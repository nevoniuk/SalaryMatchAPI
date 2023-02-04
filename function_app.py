import azure.functions as func
import logging
import imp

example_http_trigger_bp = imp.load_source('example_http_trigger', 'example_functions\example_http_trigger.py').bp

app = func.FunctionApp()

app.register_functions(example_http_trigger_bp) 