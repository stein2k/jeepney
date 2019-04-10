#include <cassert>
#include <kakaako/listobject.h>
#include <kakaako/memory.h>

using namespace kakaako;

namespace kakaako_listobject_internal
{

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
    list_resize(FLAC__ListObject *self, ssize_t newsize)
    {
        FLAC__Object **items;
        size_t new_allocated;
        ssize_t allocated = self->allocated;

        /* Bypass realloc() when a previous overallocation is large enough
        to accommodate the newsize.  If the newsize falls lower than half
        the allocated size, then proceed with the realloc() to shrink the list.
        */
        if (allocated >= newsize && newsize >= (allocated >> 1)) {
            assert(self->ob_item != NULL || newsize == 0);
            __kakaako_preprocessor_SIZE(self) = newsize;
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
        if (new_allocated > SIZE_MAX - newsize) {
            // PyErr_NoMemory();
            return -1;
        } else {
            new_allocated += newsize;
        }

        if (newsize == 0)
            new_allocated = 0;
        items = self->ob_item;
        if (new_allocated <= (SIZE_MAX / sizeof(FLAC__Object *)))
            __kakaako_preprocessor_FLAC__Mem_RESIZE(items, FLAC__Object *, new_allocated);
        else
            items = NULL;
        if (items == NULL) {
            // PyErr_NoMemory();
            return -1;
        }
        self->ob_item = items;
        __kakaako_preprocessor_SIZE(self) = newsize;
        self->allocated = new_allocated;
        return 0;
    }

    static int
    app1(FLAC__ListObject *self, FLAC__Object *v)
    {
        ssize_t n = __kakaako_preprocessor_FLAC__List_GET_SIZE(self);

        assert (v != NULL);
        if (n == __kakaako_preprocessor_SSIZE_T_MAX) {
            // PyErr_SetString(PyExc_OverflowError,
            //     "cannot add more objects to list");
            return -1;
        }

        if (list_resize(self, n+1) == -1)
            return -1;

        __kakaako_preprocessor_FLAC__INCREF(v);
        __kakaako_preprocessor_FLAC__List_SET_ITEM(self, n, v);
        return 0;
    }

}

static void
list_dealloc(kakaako::FLAC__ListObject *op)
{

    ssize_t i;
    if (op->ob_item != NULL) {
        /* Do it backwards, for Christian Tismer.
           There's a simple test case where somehow this reduces
           thrashing when a *very* large list is created and
           immediately deleted. */
        i = __kakaako_preprocessor_SIZE(op);
        while (--i >= 0) {
            __kakaako_preprocessor_FLAC__XDECREF(op->ob_item[i]);
        }
        free(op->ob_item);
    }
    __kakaako_preprocessor_TYPE(op)->tp_free((FLAC__Object *)op);

}

kakaako::FLAC__Object *
kakaako::FLAC__List_New(ssize_t size)
{

    FLAC__ListObject *op;
    size_t nbytes;

    if (size < 0) {
        return NULL;
    }

    if ((size_t)size > SIZE_MAX / sizeof(FLAC__Object*)) {
        return NULL;
    }

    nbytes = size * sizeof(FLAC__Object*);
    op = (FLAC__ListObject*)FLAC__TypeObject_GenericAlloc(&FLAC__ListType, 0);

    if (size <= 0) {
        op->ob_item = NULL;
    } else {
        op->ob_item = (FLAC__Object**)__kakaako_preprocessor_Mem_MALLOC(nbytes);
        if (op->ob_item == NULL) {
            __kakaako_preprocessor_FLAC__DECREF(op);
            return NULL;
        }
        memset(op->ob_item, 0, nbytes);
    }
    __kakaako_preprocessor_SIZE(op) = size;
    op->allocated = size;
    return (FLAC__Object*)op;

}

namespace internal = kakaako_listobject_internal;

int
kakaako::FLAC__List_Append(FLAC__Object *op, FLAC__Object *newitem)
{
    if (__kakaako_preprocessor_FLAC__List_Check(op) && (newitem != NULL))
        return internal::app1((FLAC__ListObject *)op, newitem);
    // PyErr_BadInternalCall();
    return -1;
}


kakaako::FLAC__TypeObject kakaako::FLAC__ListType = {
    __kakaako_preprocessor_FLAC__VarObject_HEAD_INIT(&kakaako::FLAC__TypeObject_Type, 0)
    "list",
    sizeof(kakaako::FLAC__ListObject),
    0,
    (kakaako::destructor)list_dealloc
};