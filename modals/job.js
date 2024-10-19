const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    job_title: {
        type: String,
        required: true,
        trim: true // Trims whitespace from the start and end of the string
    },
    description: {
        type: String,
        required: true,
        trim: true // Trims whitespace from the start and end of the string
    },
    company_name: {
        type: String,
        required: true,
        trim: true // Trims whitespace from the start and end of the string
    },
    last_registration_date: {
        type: Date,
        required: true,
    },
    job_link: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+/.test(v); // Validates that the job link is a valid URL
            },
            message: props => `${props.value} is not a valid URL!`
        }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

// Create the Job model
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
