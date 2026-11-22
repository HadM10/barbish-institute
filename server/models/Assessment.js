const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// JSON stored as TEXT so it behaves the same on MySQL (JawsDB) and MariaDB (local XAMPP).
const jsonText = (field) => ({
  type: DataTypes.TEXT("long"),
  allowNull: true,
  get() {
    const raw = this.getDataValue(field);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },
  set(value) {
    this.setDataValue(field, value == null ? null : JSON.stringify(value));
  },
});

const Assessment = sequelize.define(
  "Assessment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Unguessable id used in the public result link
    publicId: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    ageRange: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "ar",
    },
    // Where the visitor came from, e.g. "jobfair-2026" (from the QR code ?src=)
    source: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    consent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    answers: jsonText("answers"),
    result: jsonText("result"),
    // pending | completed | failed
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Copied out of the result for quick filtering in the admin panel
    recommendedPath: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    // hot | warm | cold
    leadScore: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    // new | contacted | registered | not_interested
    followUpStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "new",
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aiModel: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    inputTokens: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    outputTokens: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    generatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    // Arabic text needs utf8mb4 even if the database default is latin1.
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    // No extra `indexes` on purpose: config/db.js and server.js both call
    // sequelize.sync() at boot, and two concurrent ADD INDEX calls on a fresh
    // table make one of them fail (which can stop server.js from listening).
  }
);

module.exports = Assessment;
