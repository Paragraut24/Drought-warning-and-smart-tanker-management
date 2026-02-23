export class RouteOptimizer {
  
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static optimizeRoute(startPoint, destinations) {
    if (!destinations || destinations.length === 0) {
      return { route: [], totalDistance: 0 };
    }

    const route = [];
    const unvisited = [...destinations];
    let current = startPoint;
    let totalDistance = 0;

    // Nearest neighbor algorithm
    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(
        current.latitude,
        current.longitude,
        unvisited[0].latitude,
        unvisited[0].longitude
      );

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.calculateDistance(
          current.latitude,
          current.longitude,
          unvisited[i].latitude,
          unvisited[i].longitude
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      const nearest = unvisited.splice(nearestIndex, 1)[0];
      route.push({
        ...nearest,
        distanceFromPrevious: nearestDistance
      });
      totalDistance += nearestDistance;
      current = nearest;
    }

    return {
      route,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      estimatedTime: parseFloat((totalDistance / 40).toFixed(2)) // Assuming 40 km/h avg speed
    };
  }
}
