#ifndef __jeepney_private_geometry_point_h
#define __jeepney_private_geometry_point_h

#include "../core/object.h"

namespace jeepney
{
    
    typedef struct _Point
    {
        JeepneyObject_HEAD
        float x;
        float y;
    } Point;

}

#endif