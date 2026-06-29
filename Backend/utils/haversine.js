/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 * @param {Array} coords1 - [longitude, latitude]
 * @param {Array} coords2 - [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
exports.calculateDistance = (coords1, coords2) => {
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  
    const dLon = deg2rad(lon2 - lon1); 
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km

    return distance;
};

function deg2rad(deg) {
    return deg * (Math.PI/180);
}
