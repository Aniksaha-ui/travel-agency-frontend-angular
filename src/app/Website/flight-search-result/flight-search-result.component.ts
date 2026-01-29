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

            console.log(this.data);
            
        if (this.data && this.data.length > 0) {
            this.flights = this.data.map((tour, index) => {
                // Generate some consistent dummy times/codes based on index
                const isEven = index % 2 === 0;

                return {
                    id: tour.id,
                    code: `FL-${1000000 + tour.id}`,
                    isBestDeal: index === 0, // Mark first as best deal
                    airlineLogo: isEven ? 'https://placehold.co/50x50/003566/FFF?text=US' : 'https://placehold.co/50x50/ff4f5a/FFF?text=NV',
                    airlineName: tour.vehicle_name || "",
                    price: tour.price || 5000,
                    originalPrice: (tour.price || 5000) + 1500,

                    outbound: {
                        from: tour.route_name?.split('-')[0]?.substring(0, 3).toUpperCase() || 'DAC',
                        to: tour.route_name?.split('-')[1]?.substring(0, 3).toUpperCase() || 'DST',
                        depTime: tour.departure_at || '10:00 AM',
                        depDate: tour.departure_time ? new Date(tour.departure_time).toDateString() : 'N/A',
                        depAirport: 'Hazrat Shahjalal Int.',
                        arrTime: tour.arrival_at || '11:30 AM',
                        arrDate: tour.arrival_time ? new Date(tour.arrival_time).toDateString() : 'N/A',
                        arrAirport: `${tour.location || 'Destination'} Airport`,
                        duration: (tour.departure_time && tour.arrival_time) ? 
                            (() => {
                                const diff = Math.abs(new Date(tour.arrival_time).getTime() - new Date(tour.departure_time).getTime());
                                const hours = Math.floor(diff / 3600000);
                                const minutes = Math.floor((diff % 3600000) / 60000);
                                return `${hours}h ${minutes}m`;
                            })() : '1h 30m',
                        stopType: 'Non-Stop'
                    },

                    // Only show return flight if it's a "round trip" derived from having an end_date different from start_date
                    inbound: tour.end_date && tour.end_date !== tour.start_date ? {
                        from: tour.route_name?.split('-')[0]?.substring(0, 3).toUpperCase() || 'DAC',
                        to: tour.route_name?.split('-')[1]?.substring(0, 3).toUpperCase() || 'DST',
                        depTime: tour.departure_at || '10:00 AM',
                        depDate: tour.departure_time ? new Date(tour.departure_time).toDateString() : 'N/A',
                        depAirport: 'Hazrat Shahjalal Int.',
                        arrTime: tour.arrival_at || '11:30 AM',
                        arrDate: tour.arrival_time ? new Date(tour.arrival_time).toDateString() : 'N/A',
                        arrAirport: `${tour.location || 'Destination'} Airport`,
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
