import { pool } from "../config/database.js";
import { isEmail, isPhoneNumber } from "../safety/validators.js";

/**
 * Add a new tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function AddTenant(req, res) {
    const request = req.body;
    
    try {
        // Validate input data
        const params = {
            business_name: request.business_name,
            business_email: isEmail(request.business_email),
            phone_number: isPhoneNumber(request.phone_number),
            phone_number_code: request.phone_number_code,
            first_name: request.first_name,
            last_name: request.last_name,
            display_name: request.display_name,
            website_url: request.website_url,
        };

        const query = `INSERT INTO tenants (business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [results] = await pool.query(query, [
            params.business_name,
            params.business_email,
            params.phone_number,
            params.phone_number_code,
            params.first_name,
            params.last_name,
            params.display_name,
            params.website_url
        ]);

        const response = {
            success: true,
            message: 'Tenant created successfully',
            data: {
                insertedId: results.insertId
            }
        };

        res.status(201).json(response);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support';
        
        const errorResponse = {
            status: status,
            message: message
        };
        
        res.status(status).json(errorResponse);
    }
}