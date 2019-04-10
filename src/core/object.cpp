#include <kakaako/configuration.h>
#include <kakaako/memory.h>
#include <kakaako/object.h>

void *
kakaako::FLAC__Object_Malloc(size_t n)
{
    return __kakaako_preprocessor_Mem_MALLOC(n);
}

kakaako::FLAC__Object *
kakaako::FLAC__TypeObject_GenericAlloc(FLAC__TypeObject *type, ssize_t nitems)
{

	// function declarations
	FLAC__Object *obj;
	const size_t size = __kakaako_preprocessor_FLAC__Object_VAR_SIZE(type, nitems+1);

	// allocate memory for TypeObject
	obj = (FLAC__Object*)__kakaako_preprocessor_FLAC__Object_MALLOC(size);

	// set TypeObject memory
    memset(obj, '\0', size);

	// initialize object
    if (type->tp_itemsize == 0)
        (void)__kakaako_preprocessor_FLAC__Object_INIT(obj, type);
    else
        (void) __kakaako_preprocessor_FLAC__Object_INIT_VAR((FLAC__VarObject *)obj, type, nitems);

    return obj;


}