#include "protected/geo/geolocationutil.h"

Napi::FunctionReference jeepney::EllipseVertices::constructor;

Napi::Object jeepney::EllipseVertices::Init(Napi::Env env, Napi::Object exports)
{

    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "EllipseVertices", {
        InstanceMethod("getVertices", &EllipseVertices::GetVertices)
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("EllipseVertices", func);
    return exports;

}

jeepney::EllipseVertices::EllipseVertices(const Napi::CallbackInfo& info) 
    : Napi::ObjectWrap<jeepney::EllipseVertices>(info)
{
    Napi::Env env = info.Env();
    Napi::HandleScope scope(env);
}

Napi::Object jeepney::EllipseVertices::NewInstance(Napi::Env env, Napi::Value arg)
{
    Napi::EscapableHandleScope scope(env);
    Napi::Object obj = constructor.New({ arg });
    return scope.Escape(napi_value(obj)).ToObject();
}