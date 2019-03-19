#include <cassert>
#include <cstdlib>
#include <cstring>
#include "private/core/array.h"
#include "private/core/errors.h"
#include "private/core/memory.h"
#include "private/core/platform.h"

/* Ensure ob_item has room for at least newsize elements, and set
 * ob_size to newsize.  If newsize > ob_size on entry, the content
 * of the new slots at exit is undefined heap trash; it's the caller's
 * responsibility to overwrite them with sane values.
 * The number of allocated elements may grow, shrink, or stay the same.
 * Failure is impossible if newsize <= self.allocated on entry, although
 * that partly relies on an assumption that the system realloc() never
 * fails when passed a number of bytes <= the number of bytes last
 * allocated (the C standard doesn't guarantee this, but it's hard to
 * imagine a realloc implementation where it wouldn't be true).
 * Note that self->ob_item may change, and even if newsize is less
 * than ob_size on entry.
 */
static int 
array_resize(jeepney::Array *self, uint32_t newsize)
{
    jeepney::Object **items;
    size_t new_allocated;
    ssize_t allocated = self->allocated;

    /* Bypass realloc() when a previous overallocation is large enough
       to accommodate the newsize.  If the newsize falls lower than half
       the allocated size, then proceed with the realloc() to shrink the list.
    */
    if (allocated >= newsize && newsize >= (allocated >> 1)) {
        assert(self->ob_item != NULL || newsize == 0);
        JeepneyObject_SIZE(self) = newsize;
        return 0;
    }

    /* This over-allocates proportional to the list size, making room
     * for additional growth.  The over-allocation is mild, but is
     * enough to give linear-time amortized behavior over a long
     * sequence of appends() in the presence of a poorly-performing
     * system realloc().
     * The growth pattern is:  0, 4, 8, 16, 25, 35, 46, 58, 72, 88, ...
     */
    new_allocated = (newsize >> 3) + (newsize < 9 ? 3 : 6);

    /* check for integer overflow */
    if (new_allocated > jeepney::_SIZE_MAX - newsize) {
        jeepney::Err_NoMemory();
        return -1;
    } else {
        new_allocated += newsize;
    }

    if (newsize == 0)
        new_allocated = 0;
    items = self->ob_item;
    if (new_allocated <= (jeepney::_SIZE_MAX / sizeof(jeepney::Object *)))
        jeepney::_RESIZE(items, new_allocated);
    else
        items = NULL;
    if (items == NULL) {
        jeepney::Err_NoMemory();
        return -1;
    }
    self->ob_item = items;
    JeepneyObject_SIZE(self) = newsize;
    self->allocated = new_allocated;
    return 0;
}


static int ins1(jeepney::Array *self, uint32_t where, jeepney::Object *v)
{
    ssize_t i, n = JeepneyObject_SIZE(self);
    jeepney::Object **items;
    if (v == NULL) {
        jeepney::Err_BadInternalCall();
        return -1;
    }
    if (n == jeepney::_SSIZE_T_MAX) {
        jeepney::Err_SetString(jeepney::Exc_OverflowError,
            "cannot add more objects to list");
        return -1;
    }

    if (array_resize(self, n+1) == -1)
        return -1;

    if (where < 0) {
        where += n;
        if (where < 0)
            where = 0;
    }
    if (where > n)
        where = n;
    items = self->ob_item;
    for (i = n; --i >= where; )
        items[i+1] = items[i];
    jeepney::_INCREF(v);
    items[where] = v;
    return 0;
}

static int
app1(jeepney::Array *self, jeepney::Object *v)
{
    ssize_t n = jeepney::Array_GET_SIZE(self);

    assert (v != NULL);
    if (n == jeepney::_SSIZE_T_MAX) {
        jeepney::Err_SetString(jeepney::Exc_OverflowError,
            "cannot add more objects to list");
        return -1;
    }

    if (array_resize(self, n+1) == -1)
        return -1;

    jeepney::_INCREF(v);
    jeepney::Array_SET_ITEM(self, n, v);
    return 0;
}


int
jeepney::Array_Append(Object *op, Object *newitem)
{
    if (jeepney::Array_Check(op) && (newitem != NULL))
        return app1((Array*)op, newitem);
    jeepney::Err_BadInternalCall();
    return -1;
}

int jeepney::Array_Insert(Object *op, uint32_t where, Object *newitem)
{
    if (!jeepney::Array_Check(op)) {
        jeepney::Err_BadInternalCall();
        return -1;
    }
    return ins1((Array *)op, where, newitem);
}

ssize_t
jeepney::Array_Size(Object *op)
{
    if (!jeepney::Array_Check(op)) {
        jeepney::Err_BadInternalCall();
        return -1;
    }
    return JeepneyObject_SIZE(op);
}

jeepney::Object * jeepney::Array_New(ssize_t size)
{

    Array *op;
    size_t nbytes;

    if (size < 0) {
        Err_BadInternalCall();
        return NULL;
    }
    /* Check for overflow without an actual overflow,
     *  which can cause compiler to optimise out */
    if ((size_t)size > _SIZE_MAX / sizeof(Object *))
        return Err_NoMemory();
    nbytes = size * sizeof(Object *);
    op = (Array*)_Object_New((TypeObject*)&Array_Type);

    if (size <= 0) {
        op->ob_item = NULL;
    } else {
        op->ob_item = (Object **)_Mem_MALLOC(nbytes);
        if (op->ob_item == NULL) {
            _DECREF(op);
            return Err_NoMemory();
        }
        memset(op->ob_item, 0, nbytes);
    }
    JeepneyObject_SIZE(op) = size;
    op->allocated = size;
    return (Object *) op;

}