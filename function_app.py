import azure.functions as func
from example_http_trigger import bp as example_http_trigger_bp

app = func.FunctionApp()

app.register_functions(example_http_trigger_bp)