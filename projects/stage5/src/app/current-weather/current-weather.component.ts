import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common'
import { Component, WritableSignal } from '@angular/core'
import { FlexModule } from '@ngbracket/ngx-layout/flex'

import { ICurrentWeather } from '../interfaces'
import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css'],
  standalone: true,
  imports: [FlexModule, DecimalPipe, DatePipe, AsyncPipe],
})
export class CurrentWeatherComponent {
  currentSignal: WritableSignal<ICurrentWeather>

  constructor(private weatherService: WeatherService) {
    this.currentSignal = this.weatherService.currentWeatherSignal
  }

  getOrdinal(date: number) {
    const n = new Date(date).getDate()
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : ''
  }
}
