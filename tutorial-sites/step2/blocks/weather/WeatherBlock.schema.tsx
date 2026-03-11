import {Config, Field} from 'alinea'

export const WeatherBlock = Config.type('Weather block', {
  fields: {
    title: Field.text('Title', {required: true}),
    region: Field.text('Region', {
      required: true,
      help: 'City or region name, for example: Brussels or New York'
    })
  }
})
