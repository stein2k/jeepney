#ifndef __jeepney_listobject_h
#define __jeepney_listobject_h

#include <jeepney/object.h>

#define __jeepney_preprocessor_JeepneyList_Check(op) \
    __jeepney_preprocessor_FLAC__Type_FastSubclass(__jeepney_preprocessor_TYPE(op), __jeepney_preprocessor_FLAC__TPFLAGS_LIST_SUBCLASS)

#define __jeepney_preprocessor_JeepneyList_GET_ITEM(op, i)       (((JeepneyListObject *)(op))->ob_item[i])
#define __jeepney_preprocessor_JeepneyList_SET_ITEM(op, i, v)    (((JeepneyListObject *)(op))->ob_item[i] = (v))
#define __jeepney_preprocessor_JeepneyList_GET_SIZE(op)          __jeepney_preprocessor_SIZE(op)

namespace jeepney
{

    typedef struct {
        __jeepney_preprocessor_JeepneyObject_VAR_HEAD
        JeepneyObject **ob_item;
        ssize_t allocated;
    } JeepneyListObject;

    extern JeepneyTypeObject JeepneyListType;

    JeepneyObject * JeepneyList_New(ssize_t size);
    ssize_t JeepneyList_Size(JeepneyObject*);
    int JeepneyList_Append(JeepneyObject *, JeepneyObject *);

}

#endif