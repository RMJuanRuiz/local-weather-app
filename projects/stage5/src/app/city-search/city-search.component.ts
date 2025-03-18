import { Component, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, filter, tap } from 'rxjs'

import { WeatherService } from '../weather/weather.service'

@Component({
  standalone: true,
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class CitySearchComponent {
  weatherService = inject(WeatherService)

  search = new FormControl('', [Validators.required, Validators.minLength(2)])

  constructor() {
    this.search.valueChanges
      .pipe(
        filter(() => this.search.valid),
        debounceTime(1000),
        tap((searchValue) => this.doSearch(searchValue)),
        takeUntilDestroyed()
      )
      .subscribe()
  }

  getErrorMessage(): string {
    return this.search.hasError('minlength')
      ? 'Type more than one character to search'
      : ''
  }

  private doSearch(searchValue: string | null): void {
    if (searchValue === null) return
    const userInput = searchValue.split(',').map((s) => s.trim())
    const searchText = userInput[0]
    const country = userInput.length > 1 ? userInput[1] : undefined

    this.weatherService.updateCurrentWeather(searchText, country)
  }
}
