#include "archive.h"
#include "libdl.h"
#include "main.h"
#include <libdl.cpp>

using namespace ultralight;
using namespace std;

const char* pageHTML();
class URuntime : public LoadListener
{
	RefPtr<Overlay> overlay_;
	Unpacker unpacker;

public:
	URuntime(Ref<Window> win)
	{
		overlay_ = Overlay::Create(win, win->width(), win->height(), 0, 0);
		overlay_->view()->set_load_listener(this);
		overlay_->view()->LoadHTML(pageHTML());
	}
	virtual ~URuntime() {}
	JSValue GetMessage(const JSObject& thisObject, const JSArgs& args)
	{
		String& smsg = String();
		smsg += String("bzlib " + (String)archive_bzlib_version());
		return JSValue(smsg);
	}
	virtual void OnDOMReady(ultralight::View* caller,
		uint64_t frame_id,
		bool is_main_frame,
		const String& url) override
	{
		Ref<JSContext> context = caller->LockJSContext();
		SetJSContext(context.get());
		JSObject global = JSGlobalObject();
		global["GetMessage"] = BindJSCallbackWithRetval(&URuntime::GetMessage);
	}
};
int main()
{
	auto app = App::Create();
	auto window = Window::Create(app->main_monitor(), 640, 480, false, kWindowFlags_Titled);
	window->SetTitle("DungeonLight Engine");
	app->set_window(window);
	URuntime my_app(window);
	app->Run();
	return 0;
}
const char* pageHTML()
{
	return R"(
<html>
<head>
<meta name=viewport content="width=device-width, initial-scale=1.0">
<style type="text/css">
    * { -webkit-user-select: none; }
    body { 
    font-family: -apple-system, 'Segoe UI', Ubuntu, Arial, sans-serif; 
    text-align: center;
    background: linear-gradient(#FFF, #DDD);
    padding: 2em;
    }
    body.rainbow {
    background: linear-gradient(90deg, #ff2363, #fff175, #68ff9d, 
                                        #45dce0, #6c6eff, #9e23ff, #ff3091);
    background-size: 1000% 1000%;
    animation: ScrollGradient 10s ease infinite;
    }
    @keyframes ScrollGradient {
    0%   { background-position:0% 50%; }
    50%  { background-position:100% 50%; }
    100% { background-position:0% 50%; }
    }
    #message {
    padding-top: 2em;
    color: white;
    font-weight: bold;
    font-size: 24px;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.4);
    }
</style>
<script type="text/javascript">
function HandleButton(evt) {
    // Call our C++ callback 'GetMessage'
    var message = GetMessage();
      
    // Display the result in our 'message' div element and apply the
    // rainbow effect to our document's body.
    document.getElementById('message').innerHTML = message;
    document.body.classList.add('rainbow');
}
</script>
</head>
<body>
<button onclick="HandleButton(event);">Get the Secret Message!</button>
<div id="message"></div>
</body>
</html>
    )";
}
