function employeeCredsTemplate(firstName, lastName, email, password) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
      <h2>Welcome to LooniAttendanceMS</h2>

      <p>Dear ${firstName} ${lastName},</p>

      <p>
        Your account has been created successfully.  
        Please use the following credentials to log in and start marking your attendance.
      </p>

      <div style="margin-top: 15px; padding: 12px; border: 1px solid #ddd; background: #fafafa;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p style="margin-top: 20px;">
        You can log in using the link below:
      </p>

      <a href="https://looni-attendance-ms.com/login" 
         style="display: inline-block; padding: 10px 18px; background: #4CAF50; 
                color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Login to LooniAttendanceMS
      </a>

      <p style="margin-top: 20px;">
        Best regards,<br>
        LooniAttendanceMS Team
      </p>
    </div>
  `;
};

export default employeeCredsTemplate;
