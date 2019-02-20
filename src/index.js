import { extractKeyNameAndType, formatedDesc } from './util'
import handlebars from 'handlebars/dist/cjs/handlebars'

class APIDocGenerator {
  generate(context, requests, options) {
    const desc = formatedDesc(options.inputs['desc'])
    const successGroup = options.inputs['successGroup']
    const successExampleTitle = options.inputs['successExampleTitle']
    let output = []
    for (let i in requests) {
      let headers = []
      let params = []
      let response = []

      const request = requests[i]
      const exchange = request.getLastExchange()
      const body = exchange.responseBody
      if (exchange.responseStatusCode === 200 && body) {
        extractKeyNameAndType(JSON.parse(body), desc, response)
      }
      extractKeyNameAndType(request.headers, desc, headers)
      extractKeyNameAndType(request.urlParameters, desc, params)
      extractKeyNameAndType(request.jsonBody, desc, params)

      let view = {
        url: request.urlBase,
        method: request.method,
        request_group: request.parent ? request.parent.name : `...`,
        request_name: request.name,
        request_description: request.description,
        headers,
        params,
        response,
        responseExample: JSON.stringify(JSON.parse(body), null, 4),
        successGroup,
        successExampleTitle
      }
      const tpl = handlebars.compile(readFile('./tpl.hbs'))
      output.push(tpl(view))
    }
    return output.join('\n')
  }
}

APIDocGenerator.identifier = 'org.alilab.apiDocDefinitionGenerator'
APIDocGenerator.title = 'APIDoc definition Generator'
APIDocGenerator.languageHighlighter = 'javascript'
APIDocGenerator.fileExtension = 'js'
APIDocGenerator.inputs = [
  InputField('desc', 'Description for Field', 'KeyValueList', {
    keyName: 'Field',
    valueName: 'Desc',
    persisted: true
  }),
  InputField('successGroup', '@apiSuccess group', 'String', {
    persisted: true,
    defaultValue: 'Success'
  }),
  InputField('successExampleTitle', '@apiSuccessExample title', 'String', {
    persisted: true,
    defaultValue: 'Success Response'
  }),
]

registerCodeGenerator(APIDocGenerator)
