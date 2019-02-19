import extractKeyNameAndType from './util'
import handlebars from 'handlebars/dist/cjs/handlebars'

class APIDocGenerator {
  generate(context, requests, options) {
    let output = []
    for (let i in requests) {
      let headers = []
      let params = []
      let response = []

      const request = requests[i]
      const exchange = request.getLastExchange()
      const body = exchange.responseBody
      if (exchange.responseStatusCode === 200 && body) {
        extractKeyNameAndType(JSON.parse(body), response)
      }
      extractKeyNameAndType(request.headers, headers)
      extractKeyNameAndType(request.urlParameters, params)
      extractKeyNameAndType(request.jsonBody, params)

      let view = {
        headers,
        params,
        response,
        responseExample: JSON.stringify(JSON.parse(body), null, 4),
        method: request.method,
        request_name: request.name,
        request_description: request.description,
        request_group: request.parent ? request.parent.name : `...`,
        url: request.urlBase
      }
      const tpl = handlebars.compile(readFile('./tpl.hbs'))
      output.push(tpl(view))
    }
    return output.join('\n')
  }
}

APIDocGenerator.identifier = 'org.alilab.apiDocCodeGenerator'
APIDocGenerator.title = 'ApiDoc Generator'
APIDocGenerator.languageHighlighter = 'javascript'
APIDocGenerator.fileExtension = 'js'

registerCodeGenerator(APIDocGenerator)
