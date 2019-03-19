#include <napi.h>
#include "private/core/array.h"
#include "private/geometry/point.h"

void _simplifyDP(jeepney::Array *points, float sqTolerance)
{

    // function declarations
    uint32_t len = jeepney::Array_Size((jeepney::Object*)points);
    jeepney::Point **items = (jeepney::Point**)points->ob_item;
    jeepney::Object *markers = jeepney::Array_New(len);

    for (uint32_t n=0; n<len; ++n)
    {

        jeepney::Point *

    }


}

// return closest point on segment or distance to that point
void _sqClosestPointOnSegment(jeepney::Point p, jeepney::Point p1, jeepney::Point p2, float sqDist)
{

    // function declarations
    float x = p1.x, y = p1.y;
    float dx = p2.x - x, dy = p2.y - y;
    float dot = dx*dx + dy*dy, t;

    if (dot > 0) {
        t = ((p.x-x)*dx + (p.y-y)*dy)/dot;
        if (t > 1) {
            x = p2.x;
            y = p2.y;
        } else if (t > 0) {
            x += dx*t;
            y += dy*t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

}