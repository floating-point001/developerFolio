import React from "react";
import "./SoftwareSkill.scss";
import {skillsSection} from "../../portfolio";

// Import all skill icons using require context (webpack will bundle all matching files)
let requireSkillIcon = null;
try {
  requireSkillIcon = require.context(
    "../../assets/images/skills",
    false,
    /\.(svg|png|jpg|jpeg|webp)$/
  );
} catch (error) {
  // require.context might not be available in all webpack configurations
  console.warn("require.context not available, using direct require for custom icons");
}

export default function SoftwareSkill() {
  // Helper function to get custom icon path
  const getCustomIconPath = (skillName, customIconPath) => {
    // If customIconPath is explicitly provided, use it
    if (customIconPath) {
      try {
        return require(`../../assets/images/skills/${customIconPath}`);
      } catch (error) {
        console.warn(`Custom icon not found: ${customIconPath}`);
      }
    }

    // If require.context is available, try to auto-detect based on skillName
    if (requireSkillIcon) {
      const normalizedName = skillName.toLowerCase().replace(/\s+/g, '-');
      const possibleNames = [
        normalizedName,
        skillName.toLowerCase(),
        skillName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      ];

      for (const name of possibleNames) {
        try {
          const iconPath = requireSkillIcon.keys().find((key) => {
            const fileName = key.replace('./', '').replace(/\.(svg|png|jpg|jpeg|webp)$/i, '');
            return fileName.toLowerCase() === name.toLowerCase();
          });
          if (iconPath) {
            return requireSkillIcon(iconPath);
          }
        } catch (error) {
          // Continue to next possible name
        }
      }
    } else {
      // Fallback: try direct require with normalized name
      const normalizedName = skillName.toLowerCase().replace(/\s+/g, '-');
      try {
        return require(`../../assets/images/skills/${normalizedName}.svg`);
      } catch (error) {
        // Try without extension
        try {
          return require(`../../assets/images/skills/${normalizedName}`);
        } catch (e) {
          // Icon not found
        }
      }
    }

    return null;
  };

  return (
    <div>
      <div className="software-skills-main-div">
        <ul className="dev-icons">
          {skillsSection.softwareSkills.map((skills, i) => {
            const hasFontAwesome = skills.fontAwesomeClassname && skills.fontAwesomeClassname.trim() !== '';
            const customIcon = !hasFontAwesome 
              ? getCustomIconPath(skills.skillName, skills.customIcon) 
              : null;

            return (
              <li
                key={i}
                className="software-skill-inline"
                name={skills.skillName}
              >
                {hasFontAwesome ? (
                  <i className={skills.fontAwesomeClassname}></i>
                ) : customIcon ? (
                  <img 
                    src={customIcon} 
                    alt={skills.skillName}
                    className="custom-skill-icon"
                  />
                ) : (
                  <i className="fas fa-code"></i> // Fallback icon
                )}
                <p>{skills.skillName}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
