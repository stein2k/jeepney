#ifndef __kakaako_object_h
#define __kakaako_object_h

#include <kakaako/ordinals.h>

#define __kakaako_preprocessor_FLAC__Object_HEAD                            \
    ssize_t ob_refcnt;                                                      \
    struct _FLAC__TypeObject *ob_type;

#define __kakaako_preprocessor_FLAC__Object_HEAD_INIT(type)                 \
    1, type,

#define __kakaako_preprocessor_FLAC__VarObject_HEAD_INIT(type, size)        \
    __kakaako_preprocessor_FLAC__Object_HEAD_INIT(type) size,

#define __kakaako_preprocessor_FLAC__Object_VAR_HEAD                        \
    __kakaako_preprocessor_FLAC__Object_HEAD                                \
    uint32_t ob_size;

#define __kakaako_preprocessor_FLAC__Object_VAR_SIZE(typeobj, nitems)       \
    (size_t)                                                                \
    ( ( (typeobj)->tp_basicsize +                                           \
        (nitems)*(typeobj)->tp_itemsize +                                   \
        (__kakaako_preprocessor_SIZEOF_VOID_P - 1)                          \
      ) & ~(__kakaako_preprocessor_SIZEOF_VOID_P - 1)                       \
    )


#define __kakaako_preprocessor_REFCNT(ob)           (((FLAC__Object*)(ob))->ob_refcnt)
#define __kakaako_preprocessor_TYPE(ob)             (((FLAC__Object*)(ob))->ob_type)
#define __kakaako_preprocessor_SIZE(ob)             (((FLAC__VarObject*)(ob))->ob_size)

#define __kakaako_preprocessor_FLAC__Object_MALLOC    FLAC__Object_Malloc

/* Macros trading binary compatibility for speed. See also pymem.h.
   Note that these macros expect non-NULL object pointers.*/
#define __kakaako_preprocessor_FLAC__Object_INIT(op, typeobj) \
    ( __kakaako_preprocessor_TYPE(op) = (typeobj), __kakaako_preprocessor_FLAC__Object_NewReference((FLAC__Object *)(op)), (op) )
#define __kakaako_preprocessor_FLAC__Object_INIT_VAR(op, typeobj, size) \
    ( __kakaako_preprocessor_SIZE(op) = (size), __kakaako_preprocessor_FLAC__Object_INIT((op), (typeobj)) )

#define __kakaako_preprocessor_FLAC__TPFLAGS_LIST_SUBCLASS        (1L<<25)

#define __kakaako_preprocessor_FLAC__Type_HasFeature(t,f)  (((t)->tp_flags & (f)) != 0)
#define __kakaako_preprocessor_FLAC__Type_FastSubclass(t,f)  __kakaako_preprocessor_FLAC__Type_HasFeature(t,f)

#define __kakaako_preprocessor_FLAC__Object_NewReference(op) (              \
    __kakaako_preprocessor_REFCNT(op) = 1)
#define __kakaako_preprocessor_FLAC__Object_Dealloc(op) (                   \
    (*__kakaako_preprocessor_TYPE(op)->tp_dealloc)((FLAC__Object *)(op)))
#define __kakaako_preprocessor_FLAC__INCREF(op) (                           \
    ((FLAC__Object*)(op))->ob_refcnt++)
#define __kakaako_preprocessor_FLAC__DECREF(op)                             \
    do {                                                                    \
        if (                                                                \
        --((FLAC__Object*)(op))->ob_refcnt != 0)                            \
            ;                                                               \
        else                                                                \
        __kakaako_preprocessor_FLAC__Object_Dealloc((FLAC__Object *)(op));  \
    } while (0)
#define __kakaako_preprocessor_FLAC__XDECREF(op) do { if ((op) == NULL) ; else __kakaako_preprocessor_FLAC__DECREF(op); } while (0)

namespace kakaako
{

    typedef struct {
        __kakaako_preprocessor_FLAC__Object_HEAD
    } FLAC__Object;

    typedef struct {
        __kakaako_preprocessor_FLAC__Object_VAR_HEAD
    } FLAC__VarObject;

    typedef void (*freefunc)(void *);
    typedef void (*destructor)(FLAC__Object *);

    typedef struct _FLAC__TypeObject {
        __kakaako_preprocessor_FLAC__Object_VAR_HEAD
        const char *tp_name;
        ssize_t tp_basicsize, tp_itemsize;

        /* Methods to implement standard operations */
        destructor tp_dealloc;
        long tp_flags;
        freefunc tp_free; /* Low-level free-memory routine */

    } FLAC__TypeObject;

    extern FLAC__TypeObject FLAC__TypeObject_Type;

    FLAC__Object *FLAC__TypeObject_GenericAlloc(FLAC__TypeObject *, ssize_t);
    void * FLAC__Object_Malloc(size_t);

}

#endif