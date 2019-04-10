#ifndef __jeepney_geometry_point_h
#define __jeepney_geometry_point_h

#include <jeepney/object.h>

namespace jeepney
{

    typedef struct _point {
        __jeepney_preprocessor_JeepneyObject_HEAD
        float x;
        float y;
    } Point;

}

#endif