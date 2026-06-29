/**
 * Stand-out feature 1: Fare Split Estimator
 * Base standard per km rate for an Auto/Taxi
 */
const BASE_FARE = 50; 
const RATE_PER_KM = 15; // Example: ₹15 per km

exports.estimateFare = (distanceInKm) => {
    // Basic linear formula
    const estimatedTotal = BASE_FARE + (distanceInKm * RATE_PER_KM);
    return Math.round(estimatedTotal);
};

exports.calculateSplitFare = (totalFare, numberOfPeople) => {
    if (numberOfPeople === 0) return totalFare;
    return Math.round(totalFare / numberOfPeople);
};
