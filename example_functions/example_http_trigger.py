import azure.functions as func 

bp = func.Blueprint() 

@bp.function_name(name="ExampleHttpTrigger")
@bp.route(route="hello")
def test_function(req: func.HttpRequest) -> func.HttpResponse:
     name = req.params.get('name')
     if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

     if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
     else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )