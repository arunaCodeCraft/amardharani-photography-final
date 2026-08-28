/**
 * AMARDHARANI PHOTOGRAPHY - Google Apps Script Backend
 * 
 * This script receives enquiry form submissions from the website
 * and stores them in a Google Sheet.
 * 
 * SETUP:
 * 1. Create new Google Apps Script project
 * 2. Replace SHEET_ID below with your Google Sheet ID
 * 3. Copy this entire file into the Apps Script editor
 * 4. Deploy as Web App: Deploy > New Deployment > Web app
 *    - Execute as: Your email
 *    - Who has access: Anyone
 * 5. Copy deployment URL and paste into .env.local
 * 
 * DEPLOYMENT URL FORMAT:
 * https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercache
 */

// ============================================================
// CONFIGURATION - UPDATE WITH YOUR VALUES
// ============================================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'

// ============================================================
// MAIN HANDLER
// ============================================================

/**
 * Main function to handle POST requests from website
 * @param {Object} e - Event object from Apps Script
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents)
    
    // Validate required fields
    const validation = validateData(data)
    if (!validation.isValid) {
      return createErrorResponse(validation.message)
    }
    
    // Get spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    const sheet = spreadsheet.getActiveSheet()
    
    // Ensure headers exist
    ensureHeaders(sheet)
    
    // Prepare row data
    const rowData = [
      new Date().toISOString(),
      data.name,
      normalizePhone(data.phone),
      data.email,
      data.eventType,
      data.eventDate,
      data.location,
      data.message || '',
      data.source || 'Website',
    ]
    
    // Append to sheet
    sheet.appendRow(rowData)
    
    // Log submission
    Logger.log(`Enquiry from ${data.name}: ${data.email}`)
    
    // Return success
    return createSuccessResponse('Enquiry received successfully')
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString())
    return createErrorResponse('Server error: ' + error.toString())
  }
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validate form data
 */
function validateData(data) {
  if (!data.name || data.name.trim() === '') {
    return { isValid: false, message: 'Name is required' }
  }
  
  if (!data.phone || data.phone.trim() === '') {
    return { isValid: false, message: 'Phone is required' }
  }
  
  if (!validatePhone(data.phone)) {
    return { isValid: false, message: 'Invalid phone format' }
  }
  
  if (!data.email || data.email.trim() === '') {
    return { isValid: false, message: 'Email is required' }
  }
  
  if (!validateEmail(data.email)) {
    return { isValid: false, message: 'Invalid email format' }
  }
  
  if (!data.eventType || data.eventType.trim() === '') {
    return { isValid: false, message: 'Event type is required' }
  }
  
  if (!data.eventDate || data.eventDate.trim() === '') {
    return { isValid: false, message: 'Event date is required' }
  }
  
  if (!data.location || data.location.trim() === '') {
    return { isValid: false, message: 'Location is required' }
  }
  
  return { isValid: true, message: 'Valid' }
}

/**
 * Validate Indian phone number
 */
function validatePhone(phone) {
  const cleaned = phone.replace(/[^\d+]/g, '')
  const patterns = [
    /^\+919\d{9}$/,
    /^919\d{9}$/,
    /^9\d{9}$/,
  ]
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * Normalize phone to +91 format
 */
function normalizePhone(phone) {
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.length === 10) return '+91' + cleaned
  if (cleaned.length === 12 && cleaned.startsWith('91')) return '+' + cleaned
  return cleaned.startsWith('+') ? cleaned : '+91' + cleaned
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ============================================================
// SHEET MANAGEMENT
// ============================================================

/**
 * Ensure sheet has proper headers
 */
function ensureHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  const headers = ['Timestamp', 'Name', 'Phone', 'Email', 'Event Type', 'Event Date', 'Location', 'Message', 'Source']
  
  // If headers don't match, insert new row with headers
  if (!firstRow || firstRow[0] !== 'Timestamp') {
    sheet.insertRows(1)
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    headerRange.setFontWeight('bold')
    headerRange.setBackground('#D4AF37')
    headerRange.setFontColor('#000000')
  }
}

// ============================================================
// RESPONSES
// ============================================================

/**
 * Create success response
 */
function createSuccessResponse(message) {
  const response = {
    success: true,
    message: message,
    timestamp: new Date().toISOString(),
  }
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
}

/**
 * Create error response
 */
function createErrorResponse(message) {
  const response = {
    success: false,
    message: message,
    timestamp: new Date().toISOString(),
  }
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
}

// ============================================================
// TESTING UTILITIES
// ============================================================

/**
 * Test deployment (run from editor, check logs)
 */
function testDeployment() {
  Logger.log('=== Amardharani Photography Apps Script ===')
  Logger.log('Status: Active')
  Logger.log('Sheet ID: ' + SHEET_ID)
  
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID)
    Logger.log('Sheet Access: ✓ OK')
  } catch (error) {
    Logger.log('Sheet Access: ✗ FAILED - ' + error.toString())
  }
}
