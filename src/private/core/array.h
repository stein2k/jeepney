#ifndef __jeepney_private_core_array_h
#define __jeepney_private_core_array_h

#include "../core/object.h"

namespace jeepney
{

    typedef struct
    {
        JeepneyObject_VAR_HEAD
        Object **ob_item;
        ssize_t allocated;
    } Array;

    extern TypeObject Array_Type;

    int Array_Append(Object *, Object *);
    inline bool Array_Check(Object *op) { return Type_FastSubclass(_TYPE(op), JEEPNEY_TPFLAGS_ARRAY_SUBCLASS); }
    int Array_Insert(Object *, uint32_t, Object *);
    inline ssize_t Array_GET_SIZE(Array *op) { return JeepneyObject_SIZE(op); }
    Object * Array_New(ssize_t size);
    void Array_SET_ITEM(Array *op, ssize_t i, Object *v) { op->ob_item[i] = v; }
    ssize_t Array_Size(Object *);

}

#endif