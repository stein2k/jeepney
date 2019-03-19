#ifndef __jeepney_private_core_memory_h
#define __jeepney_private_core_memory_h

#include "platform.h"
#include "object.h"

namespace jeepney
{

    void* _REALLOC(Object **p, const size_t n);
    void _RESIZE(Object **p, const size_t n);

}

// /*
//  * The value of (p) is always clobbered by this macro regardless of success.
//  * The caller MUST check if (p) is NULL afterwards and deal with the memory
//  * error if so.  This means the original value of (p) MUST be saved for the
//  * caller's memory error handler to not lose track of it.
//  */
// #define JeepneyMem_Resize(p, type, n) \
//   ( (p) = ((size_t)(n) > PY_SSIZE_T_MAX / sizeof(type)) ? NULL :	\
// 	(type *) PyMem_Realloc((p), (n) * sizeof(type)) )
// #define PyMem_RESIZE(p, type, n) \
//   ( (p) = ((size_t)(n) > PY_SSIZE_T_MAX / sizeof(type)) ? NULL :	\
// 	(type *) PyMem_REALLOC((p), (n) * sizeof(type)) )

#endif