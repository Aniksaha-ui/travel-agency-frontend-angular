import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisaCountry, VisaRequirement, VisaType } from 'src/app/models/visa.models';
import { VisaService } from 'src/app/service/visa.service';

@Component({
  selector: 'app-visa-catalog',
  templateUrl: './visa-catalog.component.html',
  styleUrls: ['./visa-catalog.component.css'],
})
export class VisaCatalogComponent implements OnInit {
  countries: VisaCountry[] = [];
  visaTypes: VisaType[] = [];
  requirements: VisaRequirement[] = [];

  selectedCountry: VisaCountry | null = null;
  selectedVisaType: VisaType | null = null;

  isLoadingCountries = true;
  isLoadingVisaTypes = false;
  isLoadingRequirements = false;
  pageError = '';
  countrySearch = '';

  constructor(
    private visaService: VisaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.loadCatalog();
    });
  }

  get isLoggedIn(): boolean {
    return (
      localStorage.getItem('isLoggedIn') === 'true' &&
      !!localStorage.getItem('access_token')?.trim()
    );
  }

  onCountrySearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.countrySearch = input.value;
    this.loadCountries(this.countrySearch.trim());
  }

  openCountry(country: VisaCountry): void {
    this.router.navigate(['/visa/country', country.id]);
  }

  openVisaType(visaType: VisaType): void {
    const countryId = visaType.country_id || this.selectedCountry?.id;

    if (!countryId) {
      return;
    }

    this.router.navigate(['/visa/country', countryId, 'type', visaType.id]);
  }

  goToApply(): void {
    if (!this.selectedCountry || !this.selectedVisaType) {
      return;
    }

    const queryParams = {
      countryId: this.selectedCountry.id,
      visaTypeId: this.selectedVisaType.id,
    };

    if (this.isLoggedIn) {
      this.router.navigate(['/visa/apply'], { queryParams });
      return;
    }

    const returnUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/visa/apply'], { queryParams })
    );

    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl,
      },
    });
  }

  goToApplications(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: '/visa/my-applications',
        },
      });
      return;
    }

    this.router.navigate(['/visa/my-applications']);
  }

  getCountryCountLabel(country: VisaCountry): string {
    const count = this.visaTypes.filter((visaType) => visaType.country_id === country.id).length;

    if (!this.selectedCountry || this.selectedCountry.id !== country.id || !count) {
      return 'Browse Packages';
    }

    return `${count} Package${count > 1 ? 's' : ''}`;
  }

  private loadCatalog(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('countryId'));
    const visaTypeId = Number(this.route.snapshot.paramMap.get('visaTypeId'));

    this.selectedCountry = null;
    this.selectedVisaType = null;
    this.visaTypes = [];
    this.requirements = [];

    this.loadCountries(this.countrySearch.trim(), countryId || undefined, visaTypeId || undefined);
  }

  private loadCountries(search?: string, countryId?: number, visaTypeId?: number): void {
    this.isLoadingCountries = true;
    this.pageError = '';

    this.visaService.getCountries(search).subscribe({
      next: (response) => {
        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to load visa countries.';
          this.isLoadingCountries = false;
          return;
        }

        this.countries = response.data || [];
        this.selectedCountry = countryId
          ? this.countries.find((country) => country.id === countryId) || null
          : null;

        this.isLoadingCountries = false;

        if (countryId) {
          this.loadVisaTypes(countryId, visaTypeId);
        }
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to load visa countries.');
        this.isLoadingCountries = false;
      },
    });
  }

  private loadVisaTypes(countryId: number, visaTypeId?: number): void {
    this.isLoadingVisaTypes = true;
    this.pageError = '';

    this.visaService.getVisaTypes(countryId).subscribe({
      next: (response) => {
        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to load visa packages.';
          this.isLoadingVisaTypes = false;
          return;
        }

        this.visaTypes = response.data || [];
        this.selectedVisaType = visaTypeId
          ? this.visaTypes.find((visaType) => visaType.id === visaTypeId) || null
          : null;

        this.isLoadingVisaTypes = false;

        if (visaTypeId) {
          this.loadRequirements(visaTypeId);
        }
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to load visa packages.');
        this.isLoadingVisaTypes = false;
      },
    });
  }

  private loadRequirements(visaTypeId: number): void {
    this.isLoadingRequirements = true;

    this.visaService.getRequirements(visaTypeId).subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.requirements = response.data || [];
        } else {
          this.pageError = response.message || 'Unable to load visa requirements.';
        }

        this.isLoadingRequirements = false;
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to load visa requirements.'
        );
        this.isLoadingRequirements = false;
      },
    });
  }
}
