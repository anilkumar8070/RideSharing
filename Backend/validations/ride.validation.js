const { z } = require('zod');

const createRideSchema = z.object({
  body: z.object({
    transportMode: z.enum(['Train', 'Flight', 'Bus', 'Already There'], {
      errorMap: () => ({ message: 'Invalid transport mode' }),
    }),
    transportId: z.string().optional(),
    startLocationName: z.string().min(2, 'Start location is required'),
    startCoordinates: z
      .array(z.number())
      .length(2, 'Start coordinates must contain exactly [longitude, latitude]'),
    destinationName: z.string().min(2, 'Destination name is required'),
    destinationCoordinates: z
      .array(z.number())
      .length(2, 'Destination coordinates must contain exactly [longitude, latitude]'),
    timeOfArrival: z.string().datetime({
      message: 'Invalid ISO 8601 date time (e.g., 2026-05-13T10:00:00Z)',
    }),
  }),
});

module.exports = {
  createRideSchema,
};