#ifndef __jeepney_protected_geo_geolocationutil_h
#define __jeepney_protected_geo_geolocationutil_h

#include <napi.h>

namespace jeepney
{

    class EllipseVertices : Napi::ObjectWrap<EllipseVertices> 
    {
    public:
        static Napi::Object Init(Napi::Env env, Napi::Object exports);
        static Napi::Object NewInstance(Napi::Env env, Napi::Value arg);
        EllipseVertices(const Napi::CallbackInfo& info);
    private:
        static Napi::FunctionReference constructor;
        Napi::Value GetVertices(const Napi::CallbackInfo& info);
    };

}

#endif
