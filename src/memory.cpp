#include <cstdlib>
#include "private/core/memory.h"

void* jeepney::_REALLOC(Object **p, const size_t n)
{

    // ensure valid array size
    if (n > _SSIZE_T_MAX) { return NULL; }
    size_t _n = (n != 0) ? n : 1;

    return realloc((void*)p, _n);

}

void jeepney::_RESIZE(jeepney::Object **p, const size_t n)
{

    // ensure array size and reallocate
    p = (n > _SSIZE_T_MAX / sizeof(Object *)) ? NULL :
        (jeepney::Object**)_REALLOC(p, n*sizeof(Object*));

}