#include <jeepney/arrayobject.h>
#include <jeepney/listobject.h>
#include <jeepney/geometry/point.h>

namespace jeepney_LineUtil_internal
{
    float _sqClosestPointOnSegment(jeepney::Point *p, jeepney::Point *p1, jeepney::Point *p2, float sqDist);
}

using namespace jeepney;
namespace internal = jeepney_LineUtil_internal;

void _simplifyDPStep(Point **points, uint8_t *markers, float sqTolerance, uint32_t first, uint32_t last)
{

    // function declarations
    uint32_t i, index;
    float sqDist, maxSqDist=0;

    for (i=first+1; i<last-1; i++) {
        points[i];
        sqDist = internal::_sqClosestPointOnSegment(points[i], points[first], points[last], true);
        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        markers[index] = 1;
        _simplifyDPStep(points, markers, sqTolerance, first, index);
        _simplifyDPStep(points, markers, sqTolerance, index, last);
    }

}

void _simplifyDP(jeepney::JeepneyListObject *points, float sqTolerance)
{

    // function declarations
    ssize_t len = jeepney::JeepneyList_Size((jeepney::JeepneyObject*)points);
    jeepney::Point **points_ = (jeepney::Point**)points->ob_item;
    jeepney::JeepneyObject *markers = jeepney::JeepneyArray_NewFromDescr(&JeepneyArrayType,
        JeepneyArray_DescrFromType(JEEPNEY_UINT), len);
    uint8_t * markers_ = (uint8_t*)JeepneyArray_BYTES((JeepneyArray*)markers);

    markers_[0] = markers_[len-1] = 1;

    _simplifyDPStep(points_, markers_, sqTolerance, 0, len-1);
    // for (uint32_t n=0; n<len; ++n)
    // {

    //     jeepney::Point *

    // }


}

// return closest point on segment or distance to that point
float internal::_sqClosestPointOnSegment(Point *p, Point *p1, Point *p2, float sqDist)
{

    // function declarations
    float x = p1->x, y = p1->y;
    float dx = p2->x - x, dy = p2->y - y;
    float dot = dx*dx + dy*dy, t;

    if (dot > 0) {
        t = ((p->x-x)*dx + (p->y-y)*dy)/dot;
        if (t > 1) {
            x = p2->x;
            y = p2->y;
        } else if (t > 0) {
            x += dx*t;
            y += dy*t;
        }
    }

    dx = p->x - x;
    dy = p->y - y;

}