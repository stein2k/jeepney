#ifndef __jeepney_object_h
#define __jeepney_object_h

#include <cstdint>
#include <cstdlib>
#include <jeepney/platform.h>

#define __jeepney_preprocessor_JeepneyObject_HEAD                               \
    ssize_t ob_refcnt;                                                          \
    struct _typeobject *ob_type;

#define __jeepney_preprocessor_JeepneyObject_HEAD_INIT(type)                    \
    1, type,

#define __jeepney_preprocessor_FLAC__VarObject_HEAD_INIT(type, size)            \
    __jeepney_preprocessor_JeepneyObject_HEAD_INIT(type) size,

#define __jeepney_preprocessor_JeepneyObject_VAR_HEAD                           \
    __jeepney_preprocessor_JeepneyObject_HEAD                                   \
    ssize_t ob_size;

#define __jeepney_preprocessor_JeepneyObject_VAR_SIZE(typeobj, nitems)          \
    (size_t)                                                                    \
    ( ( (typeobj)->tp_basicsize +                                               \
        (nitems)*(typeobj)->tp_itemsize +                                       \
        (__jeepney_preprocessor_SIZEOF_VOID_P - 1)                              \
      ) & ~(__jeepney_preprocessor_SIZEOF_VOID_P - 1)                           \
    )


#define __jeepney_preprocessor_REFCNT(ob)           (((JeepneyObject*)(ob))->ob_refcnt)
#define __jeepney_preprocessor_TYPE(ob)             (((JeepneyObject*)(ob))->ob_type)
#define __jeepney_preprocessor_SIZE(ob)             (((FLAC__VarObject*)(ob))->ob_size)

#define __jeepney_preprocessor_JeepneyObject_MALLOC    JeepneyObject_Malloc

/* Macros trading binary compatibility for speed. See also pymem.h.
   Note that these macros expect non-NULL object pointers.*/
#define __jeepney_preprocessor_JeepneyObject_INIT(op, typeobj)                  \
    ( __jeepney_preprocessor_TYPE(op) = (typeobj), __jeepney_preprocessor_JeepneyObject_NewReference((JeepneyObject *)(op)), (op) )
#define __jeepney_preprocessor_JeepneyObject_INIT_VAR(op, typeobj, size)        \
    ( __jeepney_preprocessor_SIZE(op) = (size), __jeepney_preprocessor_JeepneyObject_INIT((op), (typeobj)) )

#define __jeepney_preprocessor_TPFLAGS_LIST_SUBCLASS        (1L<<25)

#define __jeepney_preprocessor_JeepneyType_HasFeature(t,f)  (((t)->tp_flags & (f)) != 0)
#define __jeepney_preprocessor_JeepneyType_FastSubclass(t,f)  __jeepney_preprocessor_JeepneyType_HasFeature(t,f)

#define __jeepney_preprocessor_JeepneyObject_NewReference(op) (                 \
    __jeepney_preprocessor_REFCNT(op) = 1)
#define __jeepney_preprocessor_JeepneyObject_Dealloc(op) (                      \
    (*__jeepney_preprocessor_TYPE(op)->tp_dealloc)((JeepneyObject *)(op)))
#define __jeepney_preprocessor_INCREF(op) (                                     \
    ((JeepneyObject*)(op))->ob_refcnt++)
#define __jeepney_preprocessor_DECREF(op)                                       \
    do {                                                                        \
        if (                                                                    \
        --((JeepneyObject*)(op))->ob_refcnt != 0)                               \
            ;                                                                   \
        else                                                                    \
        __jeepney_preprocessor_JeepneyObject_Dealloc((JeepneyObject *)(op));    \
    } while (0)
#define __jeepney_preprocessor_XDECREF(op) do { if ((op) == NULL) ; else __jeepney_preprocessor_DECREF(op); } while (0)

namespace jeepney
{

    typedef struct {
        __jeepney_preprocessor_JeepneyObject_HEAD
    } JeepneyObject;

    typedef struct {
        __jeepney_preprocessor_JeepneyObject_VAR_HEAD
    } JeepneyVarObject;

    typedef void (*freefunc)(void *);
    typedef void (*destructor)(JeepneyObject *);

    typedef struct _typeobject {
        __jeepney_preprocessor_JeepneyObject_VAR_HEAD
        const char *tp_name;
        ssize_t tp_basicsize, tp_itemsize;

        /* Methods to implement standard operations */
        destructor tp_dealloc;
        long tp_flags;
        freefunc tp_free; /* Low-level free-memory routine */

    } JeepneyTypeObject;

    extern JeepneyTypeObject JeepneyTypeObject_Type;

    JeepneyObject *JeepneyTypeObject_GenericAlloc(JeepneyTypeObject *, ssize_t);
    void * JeepneyObject_Malloc(size_t);

}

#endif