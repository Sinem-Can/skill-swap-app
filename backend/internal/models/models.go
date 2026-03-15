package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a platform user.
type User struct {
	ID              uint           `gorm:"primaryKey"`
	Name            string         `gorm:"size:255;not null"`
	Email           string         `gorm:"size:255;uniqueIndex;not null"`
	PasswordHash    string         `gorm:"size:255;not null"`
	ProfilePhoto    string         `gorm:"size:2048"`                    // URL formatında
	Bio             string         `gorm:"type:text"`                    // Kısa öz geçmiş / tanıtım
	Rating          float64        `gorm:"default:5.0"` // Varsayılan 5.0 (0–5 veya 1–5 ölçek)
	CompletedSwaps  int            `gorm:"default:0"`                    // Tamamlanan takas sayısı
	CreatedAt       time.Time      `gorm:"autoCreateTime"`
	UpdatedAt       time.Time      `gorm:"autoUpdateTime"`
	DeletedAt       gorm.DeletedAt `gorm:"index"`

	UserSkills []UserSkill `gorm:"foreignKey:UserID"`
}

// TableName overrides the table name for User.
func (User) TableName() string {
	return "users"
}

// Skill represents a skill tag (e.g. Go, Python, Dans).
type Skill struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:255;not null;index"`
	Category string `gorm:"size:255;index"`

	UserSkills []UserSkill `gorm:"foreignKey:SkillID"`
}

// TableName overrides the table name for Skill.
func (Skill) TableName() string {
	return "skills"
}

// UserSkillType defines whether the user offers or requires the skill.
const (
	UserSkillTypeOffers   = "offers"
	UserSkillTypeRequires = "requires"
)

// Proficiency levels for a user's skill.
const (
	ProficiencyBeginner     = "Beginner"
	ProficiencyIntermediate = "Intermediate"
	ProficiencyAdvanced     = "Advanced"
)

// Delivery mode for skill swap.
const (
	ModeOnline    = "Online"
	ModeInPerson  = "In-Person"
	ModeBoth      = "Both"
)

// UserSkill is the join model linking users and skills with a type (offers/requires).
// Many-to-many: a user can have many skills, a skill can belong to many users.
// Includes how the user offers/requires the skill: level, description, mode, duration.
type UserSkill struct {
	ID                uint           `gorm:"primaryKey"`
	UserID            uint           `gorm:"not null;uniqueIndex:idx_user_skill_type"`
	SkillID           uint           `gorm:"not null;uniqueIndex:idx_user_skill_type"`
	Type              string         `gorm:"size:32;not null;uniqueIndex:idx_user_skill_type"` // "offers" or "requires"
	ProficiencyLevel  string         `gorm:"size:32"`  // "Beginner", "Intermediate", "Advanced"
	Description       string         `gorm:"type:text"` // Yetenekle ilgili kısa açıklama
	Mode              string         `gorm:"size:32"`  // "Online", "In-Person", "Both"
	Duration          string         `gorm:"size:128"` // Örn: "1 saat/hafta"
	CreatedAt         time.Time      `gorm:"autoCreateTime"`
	UpdatedAt         time.Time      `gorm:"autoUpdateTime"`
	DeletedAt         gorm.DeletedAt `gorm:"index"`

	User  User  `gorm:"foreignKey:UserID"`
	Skill Skill `gorm:"foreignKey:SkillID"`
}

// TableName overrides the table name for UserSkill.
func (UserSkill) TableName() string {
	return "user_skills"
}
