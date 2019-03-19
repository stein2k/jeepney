#ifndef __jeepney_private_core_errors_h
#define __jeepney_private_core_errors_h

#include "object.h"

namespace jeepney
{

    /* Predefined exceptions */
    Object *    Exc_OverflowError;

    void        Err_BadInternalCall(void);
    Object *    Err_NoMemory();
    void        Err_SetString(Object *, const char *);

}

#endif