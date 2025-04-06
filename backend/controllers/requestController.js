// import { Request, validateRequest } from "../models/Request.js";
// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/appError.js";

// // Create a new request
// export const createRequest = catchAsync(async (req, res, next) => {
//   // Validate the request body
//   const { error } = validateRequest(req.body);
//   if (error) return next(new AppError(error.details[0].message, 400));

//   // Attach the logged-in user's ID to the request
//   const requestData = { ...req.body, userId: req.user.id }; // Assuming req.user contains the logged-in user

//   const request = new Request(requestData);
//   await request.save();

//   res.status(201).json({
//     status: "success",
//     data: {
//       request,
//     },
//   });


// });



// import { Request, externalRequestSchema, internalRequestSchema } from "../models/Request.js";
// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/appError.js";

// export const createRequest = catchAsync(async (req, res, next) => {
//   console.log("1. Request body:", req.body);
//   console.log("2. Authenticated user ID:", req.user.id);

//   // Determine validation schema based on request type
//   const requestType = req.body.type; // Should be "internal" or "external"
//   let validationSchema;

//   if (requestType === "external") {
//     validationSchema = externalRequestSchema;
//   } else if (requestType === "internal") {
//     validationSchema = internalRequestSchema;
//   } else {
//     return next(new AppError("Invalid request type. Must be 'internal' or 'external'", 400));
//   }

//   // Validate request body
//   const { error } = validationSchema.validate(req.body);
//   if (error) {
//     console.log("3. Validation error:", error.details[0].message);
//     return next(new AppError(error.details[0].message, 400));
//   }

//   // Create request - fix field name to match schema (userId -> user)
//   const requestData = { 
//     ...req.body, 
//     user: req.user.id, // Match the schema's 'user' field
//     status: "Draft" // Add default status if needed
//   };
//   console.log("4. Request data to save:", requestData);

//   try {
//     const request = new Request(requestData);
//     await request.save();
//     console.log("5. Request saved successfully:", request);
    
//     res.status(201).json({
//       status: "success",
//       data: { request },
//     });
//   } catch (saveErr) {
//     console.error("6. Save error:", saveErr);
//     return next(new AppError("Failed to save request", 500));
//   }
// });