#include "private/core/errors.h"
#include "private/core/object.h"

void *
jeepney::_Object_Malloc(size_t nbytes)
{
    return malloc(nbytes);
}

jeepney::Object *        
jeepney::_Object_New(jeepney::TypeObject *tp)
{

    Object *op = (Object*)_Object_Malloc(_Object_SIZE(tp));
    if (op == NULL) {
        return jeepney::Err_NoMemory();
    }
    return jeepney::_Object_Init(op, tp);

}

jeepney::Object *
jeepney::_Object_Init(Object *op, TypeObject *tp)
{
    if (op == NULL) {
        return jeepney::Err_NoMemory();
    }
    op->ob_type = tp;
    _Object_NewReference(op);
    return op;
}

void jeepney::_Object_NewReference(Object *op)
{
    op->ob_refcnt = 1;
}