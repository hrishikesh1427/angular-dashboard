// Import necessary modules and dependencies from Angular and RxJS
import { Injectable } from '@angular/core'; // Allows us to use this service throughout the Angular app
import { Subject, Observable } from 'rxjs'; // Enables reactive programming with Observables and Subjects
import { WebSocketSubject } from 'rxjs/webSocket'; // Provides WebSocketSubject to manage WebSocket connections
import { environment } from '../environments/environment'; // Imports environment configuration (e.g., WebSocket URL)

// Define a Container interface to structure the container data
// Each container has an 'id' (unique identifier) and an optional 'weight' which could be null
interface Container {
  id: string;
  weight: number | null;
}

// Define a WebSocketResponse interface to structure the WebSocket response data
// The WebSocket response contains 'frames' and 'locationData'
interface WebSocketResponse {
  frames: Record<string, string>;
  locationData: Record<
    string,
    {
      totalCount: number;
      containers: Container[];
      cameraId: string;
      cameraStatus: string;
    }
  >;
}

// Mark this class as a service that can be injected into other components or services
@Injectable({
  providedIn: 'root', // Makes the service available app-wide
})
export class DataService {
  // 'socket' will be used to manage the WebSocket connection to the server
  private socket!: WebSocketSubject<any>;
  frame_array: any[] = [];

  // 'locationDataSubject' holds real-time location data and allows other parts of the app to subscribe to changes
  private locationDataSubject = new Subject<WebSocketResponse>();

  // The constructor automatically runs when this service is first used in the app
  constructor() {
    this.connectWebSocket(); // Initialize WebSocket connection upon service creation
  }

  // Private method to establish a WebSocket connection and listen for data
  private connectWebSocket() {
    // Connect to the WebSocket server using the URL defined in the environment config
    this.socket = new WebSocketSubject(environment.websocketUrl);

    // Subscribe to the WebSocket stream to handle incoming data or errors
    this.socket.subscribe(
      // 'data' callback function - executed whenever new data is received
      (data: WebSocketResponse) => {
        console.log('Received data:', data); // Log received data for debugging

        // Check if incoming data contains 'locationData' and, if so, push it to 'locationDataSubject'
        if (data && data.frames && data.locationData) {
          this.locationDataSubject.next(data); // Notify all subscribers with the new data
        }
      },
      // 'error' callback function - executed if there's an error with the WebSocket connection
      (error) => {
        console.error('WebSocket error:', error); // Log the error for troubleshooting
      }
    );
  }

  // Public method to get the location data as an Observable, allowing other parts of the app to subscribe to it
  getLocationData(): Observable<WebSocketResponse> {
    // Convert 'locationDataSubject' to an Observable for external components to subscribe to
    return this.locationDataSubject.asObservable();
  }
}
