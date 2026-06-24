const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        // title ka lowercase + trimmed version — sirf isi pe unique index lagayenge.
        // "Chat 1", "chat 1", "  Chat 1  " — sab isi field mein "chat 1" ban jayenge,
        // taaki case/space ka farak duplicate-check mein na aaye
        normalizedTitle: {
            type: String,
            required: true
        },
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Ek user ke andar same naam (case/space-insensitive) ka dusra chat ban hi nahi sakta —
// database level pe guarantee, frontend check bypass ho bhi jaye to ye nahi hoga
chatSchema.index({ user: 1, normalizedTitle: 1 }, { unique: true });

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;