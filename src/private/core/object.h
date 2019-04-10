#ifndef __jeepney_private_core_object_h
#define __jeepney_private_core_object_h

#define __jeepney_preprocessor_JeepneyObject_HEAD                            \
    ssize_t ob_refcnt;                                                      \
    struct _FLAC__TypeObject *ob_type;

#define __jeepney_preprocessor_JeepneyObject_HEAD_INIT(type)                 \
    1, type,

#define __jeepney_preprocessor_FLAC__VarObject_HEAD_INIT(type, size)        \
    __jeepney_preprocessor_JeepneyObject_HEAD_INIT(type) size,

#define __jeepney_preprocessor_JeepneyObject_VAR_HEAD                        \
    __jeepney_preprocessor_JeepneyObject_HEAD                                \
    uint32_t ob_size;

#define __jeepney_preprocessor_JeepneyObject_VAR_SIZE(typeobj, nitems)       \
    (size_t)                                                                \
    ( ( (typeobj)->tp_basicsize +                                           \
        (nitems)*(typeobj)->tp_itemsize +                                   \
        (__jeepney_preprocessor_SIZEOF_VOID_P - 1)                          \
      ) & ~(__jeepney_preprocessor_SIZEOF_VOID_P - 1)                       \
    )


#define __jeepney_preprocessor_REFCNT(ob)           (((JeepneyObject*)(ob))->ob_refcnt)
#define __jeepney_preprocessor_TYPE(ob)             (((JeepneyObject*)(ob))->ob_type)
#define __jeepney_preprocessor_SIZE(ob)             (((FLAC__VarObject*)(ob))->ob_size)

#define __jeepney_preprocessor_JeepneyObject_MALLOC    JeepneyObject_Malloc

/* Macros trading binary compatibility for speed. See also pymem.h.
   Note that these macros expect non-NULL object pointers.*/
#define __jeepney_preprocessor_JeepneyObject_INIT(op, typeobj) \
    ( __jeepney_preprocessor_TYPE(op) = (typeobj), __jeepney_preprocessor_JeepneyObject_NewReference((JeepneyObject *)(op)), (op) )
#define __jeepney_preprocessor_JeepneyObject_INIT_VAR(op, typeobj, size) \
    ( __jeepney_preprocessor_SIZE(op) = (size), __jeepney_preprocessor_JeepneyObject_INIT((op), (typeobj)) )

#define __jeepney_preprocessor_FLAC__TPFLAGS_LIST_SUBCLASS        (1L<<25)

#define __jeepney_preprocessor_FLAC__Type_HasFeature(t,f)  (((t)->tp_flags & (f)) != 0)
#define __jeepney_preprocessor_FLAC__Type_FastSubclass(t,f)  __jeepney_preprocessor_FLAC__Type_HasFeature(t,f)

#define __jeepney_preprocessor_JeepneyObject_NewReference(op) (              \
    __jeepney_preprocessor_REFCNT(op) = 1)
#define __jeepney_preprocessor_JeepneyObject_Dealloc(op) (                   \
    (*__jeepney_preprocessor_TYPE(op)->tp_dealloc)((JeepneyObject *)(op)))
#define __jeepney_preprocessor_FLAC__INCREF(op) (                           \
    ((JeepneyObject*)(op))->ob_refcnt++)
#define __jeepney_preprocessor_FLAC__DECREF(op)                             \
    do {                                                                    \
        if (                                                                \
        --((JeepneyObject*)(op))->ob_refcnt != 0)                            \
            ;                                                               \
        else                                                                \
        __jeepney_preprocessor_JeepneyObject_Dealloc((JeepneyObject *)(op));  \
    } while (0)
#define __jeepney_preprocessor_FLAC__XDECREF(op) do { if ((op) == NULL) ; else __jeepney_preprocessor_FLAC__DECREF(op); } while (0)

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

    typedef struct _FLAC__TypeObject {
        __jeepney_preprocessor_JeepneyObject_VAR_HEAD
        const char *tp_name;
        ssize_t tp_basicsize, tp_itemsize;

        /* Methods to implement standard operations */
        destructor tp_dealloc;
        long tp_flags;
        freefunc tp_free; /* Low-level free-memory routine */

    } FLAC__TypeObject;

    extern FLAC__TypeObject FLAC__TypeObject_Type;

    JeepneyObject *FLAC__TypeObject_GenericAlloc(FLAC__TypeObject *, ssize_t);
    void * JeepneyObject_Malloc(size_t);

}

// #include <cstdint>
// #include <cstdlib>

// #define JeepneyObject_HEAD                  \
//     struct _typeobject *ob_type;            \
//     ssize_t ob_refcnt;
// #define JeepneyObject_VAR_HEAD              \
//     JeepneyObject_HEAD                      \
//     uint32_t ob_size;

// namespace jeepney
// {

//     typedef struct _object {
//         JeepneyObject_HEAD
//     } Object;

//     typedef struct {
//         JeepneyObject_VAR_HEAD
//     } VarObject;

//     typedef struct _typeobject {
//         JeepneyObject_VAR_HEAD
//         const char *tp_name;
//         ssize_t tp_basicsize, tp_itemsize;
//         long tp_flags;
//     } TypeObject;

//     void *          _Object_Malloc(size_t);
//     Object *        _Object_New(TypeObject *tp);
//     void            _Object_NewReference(Object *);
//     Object *        _Object_Init(Object *, TypeObject *);

//     inline TypeObject* _TYPE(Object *ob) { return ob->ob_type; }

//     inline bool Type_HasFeature(TypeObject *t, long f) { return ((t->tp_flags & f) != 0); }
//     inline bool Type_FastSubclass(TypeObject *t, long f) { return Type_HasFeature(t, f); }

//     extern uint32_t JEEPNEY_TPFLAGS_ARRAY_SUBCLASS;

//     inline void _INCREF(Object *op) { op->ob_refcnt++; }

//     inline ssize_t _Object_SIZE(TypeObject *typeobj) { return typeobj->tp_basicsize; }

// }

// #define JeepneyObject_SIZE(ob)              (((jeepney::VarObject*)(ob))->ob_size)

#endif