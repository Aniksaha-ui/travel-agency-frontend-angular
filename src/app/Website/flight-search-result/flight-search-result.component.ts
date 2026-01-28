import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-flight-search-result',
    templateUrl: './flight-search-result.component.html',
    styleUrls: ['./flight-search-result.component.css']
})
export class FlightSearchResultComponent implements OnInit, OnChanges {

    @Input() data: any[] = [];
    flights: any[] = [];

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.mapData();
    }

    ngOnChanges(): void {
        this.mapData();
    }

    mapData() {
        if (this.data && this.data.length > 0) {
            this.flights = this.data.map((tour, index) => {
                // Generate some consistent dummy times/codes based on index
                const isEven = index % 2 === 0;

                return {
                    id: tour.id,
                    code: `FL-${1000 + tour.id}`,
                    isBestDeal: index === 0, // Mark first as best deal
                    airlineLogo: isEven ? 'https://placehold.co/50x50/003566/FFF?text=US' : 'https://placehold.co/50x50/ff4f5a/FFF?text=NV',
                    airlineName: isEven ? 'US-Bangla Airlines' : 'Novoair',
                    price: tour.price || 5000,
                    originalPrice: (tour.price || 5000) + 1500,

                    outbound: {
                        from: 'DAC', // Assuming mostly Dhaka based
                        to: tour.location ? tour.location.substring(0, 3).toUpperCase() : 'DST',
                        depTime: '10:00 AM',
                        depDate: tour.start_date ? new Date(tour.start_date).toDateString() : 'N/A',
                        depAirport: 'Hazrat Shahjalal Int.',
                        arrTime: '11:30 AM',
                        arrDate: tour.start_date ? new Date(tour.start_date).toDateString() : 'N/A',
                        arrAirport: `${tour.location || 'Destination'} Airport`,
                        duration: '1h 30m',
                        stopType: 'Non-Stop'
                    },

                    // Only show return flight if it's a "round trip" derived from having an end_date different from start_date
                    inbound: tour.end_date && tour.end_date !== tour.start_date ? {
                        from: tour.location ? tour.location.substring(0, 3).toUpperCase() : 'DST',
                        to: 'DAC',
                        depTime: '4:00 PM',
                        depDate: tour.end_date ? new Date(tour.end_date).toDateString() : 'N/A',
                        depAirport: `${tour.location || 'Destination'} Airport`,
                        arrTime: '05:30 PM',
                        arrDate: tour.end_date ? new Date(tour.end_date).toDateString() : 'N/A',
                        arrAirport: 'Hazrat Shahjalal Int.',
                        duration: '1h 30m',
                        stopType: 'Non-Stop'
                    } : null,

                    showDetails: false
                };
            });
        } else {
            // Fallback/Empty state or keep previous logic if strictly needed, 
            // but user asked to populate based on data.
            this.flights = [];
        }
    }

    onSelect(flight: any) {
        this.router.navigate(['/tour', flight.id]);
    }

    toggleDetails(flight: any) {
        flight.showDetails = !flight.showDetails;
    }
}
