#ifndef __kakaako_listobject_h
#define __kakaako_listobject_h

#include <kakaako/object.h>

#define __kakaako_preprocessor_FLAC__List_Check(op) \
    __kakaako_preprocessor_FLAC__Type_FastSubclass(__kakaako_preprocessor_TYPE(op), __kakaako_preprocessor_FLAC__TPFLAGS_LIST_SUBCLASS)

#define __kakaako_preprocessor_FLAC__List_GET_ITEM(op, i)       (((FLAC__ListObject *)(op))->ob_item[i])
#define __kakaako_preprocessor_FLAC__List_SET_ITEM(op, i, v)    (((FLAC__ListObject *)(op))->ob_item[i] = (v))
#define __kakaako_preprocessor_FLAC__List_GET_SIZE(op)          __kakaako_preprocessor_SIZE(op)

namespace kakaako
{

    typedef struct {
        __kakaako_preprocessor_FLAC__Object_VAR_HEAD
        FLAC__Object **ob_item;
        ssize_t allocated;
    } FLAC__ListObject;

    extern FLAC__TypeObject FLAC__ListType;

    FLAC__Object * FLAC__List_New(ssize_t size);
    int FLAC__List_Append(FLAC__Object *, FLAC__Object *);

}

#endif