#include <node_api.h>
#include <cassert>
#include <cstdio>

class XPlotInterface
{
public:
    static napi_value Init(napi_env env, napi_value exports);
    static void Destructor(napi_env env, void* nativeObject, void* finalize_hint);

private:
    explicit XPlotInterface(double value_ = 0);
    ~XPlotInterface();

    static napi_value New(napi_env env, napi_callback_info info);
    static napi_value foo(napi_env env, napi_callback_info info);
    static napi_ref constructor;
    double value_;
    napi_env env_;
    napi_ref wrapper_;

};

napi_ref XPlotInterface::constructor;

XPlotInterface::XPlotInterface(double value)
    : value_(value), env_(nullptr), wrapper_(nullptr) {}

XPlotInterface::~XPlotInterface() {
  napi_delete_reference(env_, wrapper_);
}

void XPlotInterface::Destructor(napi_env env,
                          void* nativeObject,
                          void* /*finalize_hint*/) {
  reinterpret_cast<XPlotInterface*>(nativeObject)->~XPlotInterface();
}

#define DECLARE_NAPI_METHOD(name, func)                                        \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_value XPlotInterface::Init(napi_env env, napi_value exports) {

    napi_status status;
    napi_property_descriptor properties[] = {
        DECLARE_NAPI_METHOD("foo", foo)
    };

    printf("Init\n");

    napi_value cons;
    status = napi_define_class(
        env, "XPlotInterface", NAPI_AUTO_LENGTH, New, nullptr, 3, properties, &cons);
    assert(status == napi_ok);

    status = napi_create_reference(env, cons, 1, &constructor);
    assert(status == napi_ok);

    status = napi_set_named_property(env, exports, "XPlotInterface", cons);
    assert(status == napi_ok);
    return exports;

}

napi_value Init(napi_env env, napi_value exports) {
    printf("Init\n");
    return XPlotInterface::Init(env, exports);
}

napi_value XPlotInterface::New(napi_env env, napi_callback_info info) {
  napi_status status;

  napi_value target;
  status = napi_get_new_target(env, info, &target);
  assert(status == napi_ok);
  bool is_constructor = target != nullptr;

  if (is_constructor) {
    // Invoked as constructor: `new XPlotInterface(...)`
    size_t argc = 1;
    napi_value args[1];
    napi_value jsthis;
    status = napi_get_cb_info(env, info, &argc, args, &jsthis, nullptr);
    assert(status == napi_ok);

    double value = 0;

    napi_valuetype valuetype;
    status = napi_typeof(env, args[0], &valuetype);
    assert(status == napi_ok);

    if (valuetype != napi_undefined) {
      status = napi_get_value_double(env, args[0], &value);
      assert(status == napi_ok);
    }

    XPlotInterface* obj = new XPlotInterface(value);

    obj->env_ = env;
    status = napi_wrap(env,
                       jsthis,
                       reinterpret_cast<void*>(obj),
                       XPlotInterface::Destructor,
                       nullptr,  // finalize_hint
                       &obj->wrapper_);
    assert(status == napi_ok);

    return jsthis;
  } else {
    // Invoked as plain function `XPlotInterface(...)`, turn into construct call.
    size_t argc_ = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc_, args, nullptr, nullptr);
    assert(status == napi_ok);

    const size_t argc = 1;
    napi_value argv[argc] = {args[0]};

    napi_value cons;
    status = napi_get_reference_value(env, constructor, &cons);
    assert(status == napi_ok);

    napi_value instance;
    status = napi_new_instance(env, cons, argc, argv, &instance);
    assert(status == napi_ok);

    return instance;
  }
}

napi_value XPlotInterface::foo(napi_env env, napi_callback_info info) {
	napi_status status;

	napi_value jsthis;
	status = napi_get_cb_info(env, info, nullptr, nullptr, &jsthis, nullptr);
	assert(status == napi_ok);

	XPlotInterface* obj;
	status = napi_unwrap(env, jsthis, reinterpret_cast<void**>(&obj));
	assert(status == napi_ok);

	obj->value_ += 1;

	napi_value num;
	status = napi_create_double(env, obj->value_, &num);
	assert(status == napi_ok);

	return num;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)