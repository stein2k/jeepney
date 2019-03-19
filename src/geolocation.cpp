#include <napi.h>

Napi::Object CreateObject(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Object obj = Napi::Object::New(env);
    obj.Set(Napi::String::New(env, "msg"), info[0].ToString());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {

    Napi::Function func = DefineClass();

    return Napi::Function::New(env, CreateObject, "createObject");
}

NODE_API_MODULE(GeolocationUtil, Init)