#ifndef __jeepney_private_core_object_h
#define __jeepney_private_core_object_h

#include <cstdint>
#include <cstdlib>

#define JeepneyObject_HEAD                  \
    struct _typeobject *ob_type;            \
    ssize_t ob_refcnt;
#define JeepneyObject_VAR_HEAD              \
    JeepneyObject_HEAD                      \
    uint32_t ob_size;

namespace jeepney
{

    typedef struct _object {
        JeepneyObject_HEAD
    } Object;

    typedef struct {
        JeepneyObject_VAR_HEAD
    } VarObject;

    typedef struct _typeobject {
        JeepneyObject_VAR_HEAD
        const char *tp_name;
        ssize_t tp_basicsize, tp_itemsize;
        long tp_flags;
    } TypeObject;

    void *          _Object_Malloc(size_t);
    Object *        _Object_New(TypeObject *tp);
    void            _Object_NewReference(Object *);
    Object *        _Object_Init(Object *, TypeObject *);

    inline TypeObject* _TYPE(Object *ob) { return ob->ob_type; }

    inline bool Type_HasFeature(TypeObject *t, long f) { return ((t->tp_flags & f) != 0); }
    inline bool Type_FastSubclass(TypeObject *t, long f) { return Type_HasFeature(t, f); }

    extern uint32_t JEEPNEY_TPFLAGS_ARRAY_SUBCLASS;

    inline void _INCREF(Object *op) { op->ob_refcnt++; }

    inline ssize_t _Object_SIZE(TypeObject *typeobj) { return typeobj->tp_basicsize; }

}

#define JeepneyObject_SIZE(ob)              (((jeepney::VarObject*)(ob))->ob_size)

#endif