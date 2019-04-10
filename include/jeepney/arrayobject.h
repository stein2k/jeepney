#ifndef __jeepney_arrayobject_h
#define __jeepney_arrayobject_h

#include <jeepney/object.h>

namespace jeepney
{

    enum JEEPNEY_TYPES {
        JEEPNEY_BOOL = 0,
        JEEPNEY_USHORT,
        JEEPNEY_UINT
    };

    /* forward declaration */
    struct _PyArray_Descr;

    typedef struct _JeepneyArray_Descr {
        __jeepney_preprocessor_JeepneyObject_HEAD
        char kind, type, flags;
        int type_num;
    } JeepneyArray_Descr;

    JeepneyArray_Descr * JeepneyArray_DescrFromType(int);

    typedef struct {
        __jeepney_preprocessor_JeepneyObject_VAR_HEAD
        char *data;
        JeepneyArray_Descr *descr;
    } JeepneyArray;

    extern JeepneyTypeObject JeepneyArrayType;

    JeepneyObject * JeepneyArray_NewFromDescr(JeepneyTypeObject *, JeepneyArray_Descr *, ssize_t);
    char * JeepneyArray_BYTES(JeepneyArray *);

}

#endif