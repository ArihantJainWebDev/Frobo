// New examples showcasing logical operators and landing pages
export const newExamples = [
  {
    id: 'logical-operators',
    name: '🆕 Logical Operators',
    description: 'Use AND (&&), OR (||), NOT (!) operators',
    code: `component AccessControl {
  state isLoggedIn = true
  state hasPermission = true
  state isBlocked = false
  state age = 25
  state hasLicense = true
  
  h1 "🔐 Access Control System" style={ fontSize: "36", color: "#1e293b" }
  
  container bg="#f8fafc" padding="24" rounded="12" {
    h2 "User Status" style={ fontSize: "24", color: "#475569" }
    
    if isLoggedIn && hasPermission && !isBlocked {
      container bg="#d1fae5" padding="20" rounded="8" {
        text "✅ Full Access Granted" style={ fontSize: "20", color: "#065f46", fontWeight: "600" }
        text "You have all required permissions" style={ color: "#047857" }
      }
    } else if isLoggedIn && !hasPermission {
      container bg="#fef3c7" padding="20" rounded="8" {
        text "⚠️ Limited Access" style={ fontSize: "20", color: "#92400e", fontWeight: "600" }
        text "Missing required permissions" style={ color: "#b45309" }
      }
    } else if !isLoggedIn {
      container bg="#fee2e2" padding="20" rounded="8" {
        text "❌ Please Log In" style={ fontSize: "20", color: "#991b1b", fontWeight: "600" }
        text "Authentication required" style={ color: "#dc2626" }
      }
    } else {
      container bg="#fee2e2" padding="20" rounded="8" {
        text "🚫 Access Denied" style={ fontSize: "20", color: "#991b1b", fontWeight: "600" }
        text "Account is blocked" style={ color: "#dc2626" }
      }
    }
    
    row gap="10" {
      button "Toggle Login" onClick=toggleLogin bg="#3b82f6" color="white" padding="12" rounded="8"
      button "Toggle Permission" onClick=togglePermission bg="#8b5cf6" color="white" padding="12" rounded="8"
      button "Toggle Block" onClick=toggleBlock bg="#ef4444" color="white" padding="12" rounded="8"
    }
  }
  
  container bg="#f8fafc" padding="24" rounded="12" {
    h2 "Driving Status" style={ fontSize: "24", color: "#475569" }
    
    if age >= 18 && hasLicense {
      container bg="#d1fae5" padding="20" rounded="8" {
        text "✅ Can Drive" style={ fontSize: "20", color: "#065f46", fontWeight: "600" }
      }
    } else if age >= 18 && !hasLicense {
      container bg="#fef3c7" padding="20" rounded="8" {
        text "⚠️ Need License" style={ fontSize: "20", color: "#92400e", fontWeight: "600" }
      }
    } else {
      container bg="#fee2e2" padding="20" rounded="8" {
        text "❌ Too Young" style={ fontSize: "20", color: "#991b1b", fontWeight: "600" }
      }
    }
    
    text "Age: {age}" style={ fontSize: "18", color: "#64748b" }
    
    row gap="10" {
      button "Age +1" onClick=increaseAge bg="#10b981" color="white" padding="12" rounded="8"
      button "Age -1" onClick=decreaseAge bg="#ef4444" color="white" padding="12" rounded="8"
      button "Toggle License" onClick=toggleLicense bg="#3b82f6" color="white" padding="12" rounded="8"
    }
  }
  
  container bg="#dbeafe" padding="24" rounded="12" {
    h2 "Complex Logic" style={ fontSize: "24", color: "#1e40af" }
    
    if (isLoggedIn && hasPermission) || age >= 21 {
      text "✅ Can access premium content" style={ fontSize: "18", color: "#1e40af", fontWeight: "600" }
    } else {
      text "❌ Premium content restricted" style={ fontSize: "18", color: "#991b1b", fontWeight: "600" }
    }
  }
}

function toggleLogin() {
  isLoggedIn = !isLoggedIn
}

function togglePermission() {
  hasPermission = !hasPermission
}

function toggleBlock() {
  isBlocked = !isBlocked
}

function increaseAge() {
  age = age + 1
}

function decreaseAge() {
  age = age - 1
}

function toggleLicense() {
  hasLicense = !hasLicense
}`
  },
  {
    id: 'landing-page-saas',
    name: '🌐 SaaS Landing Page',
    description: 'Modern SaaS product landing page',
    code: `component SaaSLanding {
  state email = ""
  state showSuccess = false
  
  container style={ maxWidth: "1200", margin: "0 auto", padding: "20" } {
    row style={ justifyContent: "space-between", alignItems: "center", padding: "20 0" } {
      h1 "⚡ FastApp" style={ fontSize: "32", color: "#1e293b", fontWeight: "800" }
      
      row gap="16" {
        button "Features" bg="transparent" color="#64748b" padding="8"
        button "Pricing" bg="transparent" color="#64748b" padding="8"
        button "Sign Up" bg="#3b82f6" color="white" padding="12" rounded="8"
      }
    }
    
    center height="400" style={ background: "#3b82f6", borderRadius: "24", marginTop: "40" } {
      column gap="24" {
        h1 "Build Faster, Ship Smarter" color="white" style={ fontSize: "48", fontWeight: "900", textAlign: "center" }
        text "The all-in-one platform for modern teams" color="white" style={ fontSize: "20", textAlign: "center", opacity: "0.9" }
        
        row gap="12" style={ justifyContent: "center" } {
          input "Enter your email" value=email style={ padding: "16", borderRadius: "8", width: "300", fontSize: "16" }
          button "Get Started" onClick=signup bg="#1e293b" color="white" padding="16" rounded="8" style={ fontSize: "16", fontWeight: "600" }
        }
        
        if showSuccess {
          text "✅ Thanks for signing up!" color="white" style={ fontSize: "18", fontWeight: "600" }
        }
      }
    }
    
    h2 "Why Choose FastApp?" style={ fontSize: "36", color: "#1e293b", textAlign: "center", marginTop: "80" }
    
    grid cols="3" gap="24" style={ marginTop: "40" } {
      container bg="#f8fafc" padding="32" rounded="16" {
        text "⚡" style={ fontSize: "48" }
        h3 "Lightning Fast" style={ fontSize: "24", color: "#1e293b", marginTop: "16" }
        text "Deploy in seconds, not hours" style={ fontSize: "16", color: "#64748b", marginTop: "8" }
      }
      
      container bg="#f8fafc" padding="32" rounded="16" {
        text "🔒" style={ fontSize: "48" }
        h3 "Secure by Default" style={ fontSize: "24", color: "#1e293b", marginTop: "16" }
        text "Enterprise-grade security built-in" style={ fontSize: "16", color: "#64748b", marginTop: "8" }
      }
      
      container bg="#f8fafc" padding="32" rounded="16" {
        text "📈" style={ fontSize: "48" }
        h3 "Scale Effortlessly" style={ fontSize: "24", color: "#1e293b", marginTop: "16" }
        text "From startup to enterprise" style={ fontSize: "16", color: "#64748b", marginTop: "8" }
      }
    }
    
    center height="300" bg="#1e293b" rounded="24" style={ marginTop: "80" } {
      column gap="24" {
        h2 "Ready to get started?" color="white" style={ fontSize: "36", fontWeight: "800" }
        button "Start Free Trial" onClick=signup bg="#3b82f6" color="white" padding="20" rounded="12" style={ fontSize: "20", fontWeight: "600" }
      }
    }
  }
}

function signup() {
  showSuccess = true
}`
  },
  {
    id: 'landing-page-portfolio',
    name: '👤 Portfolio Website',
    description: 'Personal portfolio landing page',
    code: `component Portfolio {
  state activeSection = "about"
  
  container style={ maxWidth: "1000", margin: "0 auto", padding: "40" } {
    center height="500" style={ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "24" } {
      column gap="20" {
        text "👋" style={ fontSize: "64" }
        h1 "Hi, I'm Alex Chen" color="white" style={ fontSize: "48", fontWeight: "900" }
        text "Full-Stack Developer & Designer" color="white" style={ fontSize: "24", opacity: "0.9" }
        
        row gap="16" style={ marginTop: "20" } {
          button "View Work" onClick=showProjects bg="white" color="#667eea" padding="16" rounded="12" style={ fontSize: "18", fontWeight: "600" }
          button "Contact Me" onClick=showContact bg="transparent" color="white" padding="16" rounded="12" style={ fontSize: "18", fontWeight: "600", border: "2px solid white" }
        }
      }
    }
    
    h2 "About Me" style={ fontSize: "36", color: "#1e293b", marginTop: "80" }
    container bg="#f8fafc" padding="32" rounded="16" {
      text "I'm a passionate developer with 5+ years of experience building web applications. I love creating beautiful, functional, and user-friendly interfaces." style={ fontSize: "18", color: "#64748b", lineHeight: "1.8" }
    }
    
    h2 "Skills" style={ fontSize: "36", color: "#1e293b", marginTop: "60" }
    grid cols="4" gap="16" {
      container bg="#dbeafe" padding="20" rounded="12" {
        text "React" style={ fontSize: "18", color: "#1e40af", fontWeight: "600", textAlign: "center" }
      }
      container bg="#fef3c7" padding="20" rounded="12" {
        text "TypeScript" style={ fontSize: "18", color: "#92400e", fontWeight: "600", textAlign: "center" }
      }
      container bg="#d1fae5" padding="20" rounded="12" {
        text "Node.js" style={ fontSize: "18", color: "#065f46", fontWeight: "600", textAlign: "center" }
      }
      container bg="#fce7f3" padding="20" rounded="12" {
        text "Design" style={ fontSize: "18", color: "#831843", fontWeight: "600", textAlign: "center" }
      }
    }
    
    h2 "Featured Projects" style={ fontSize: "36", color: "#1e293b", marginTop: "60" }
    grid cols="2" gap="24" {
      container bg="#f8fafc" padding="32" rounded="16" {
        container bg="#3b82f6" height="200" rounded="12" {
          center height="200" {
            text "🚀" style={ fontSize: "64" }
          }
        }
        h3 "E-Commerce Platform" style={ fontSize: "24", color: "#1e293b", marginTop: "16" }
        text "Full-stack shopping experience with real-time inventory" style={ fontSize: "16", color: "#64748b", marginTop: "8" }
      }
      
      container bg="#f8fafc" padding="32" rounded="16" {
        container bg="#8b5cf6" height="200" rounded="12" {
          center height="200" {
            text "📱" style={ fontSize: "64" }
          }
        }
        h3 "Mobile App" style={ fontSize: "24", color: "#1e293b", marginTop: "16" }
        text "Cross-platform fitness tracking application" style={ fontSize: "16", color: "#64748b", marginTop: "8" }
      }
    }
    
    center height="250" bg="#1e293b" rounded="24" style={ marginTop: "80" } {
      column gap="20" {
        h2 "Let's Work Together" color="white" style={ fontSize: "36", fontWeight: "800" }
        text "I'm always open to new opportunities and collaborations" color="white" style={ fontSize: "18", opacity: "0.9" }
        button "Get in Touch" bg="#3b82f6" color="white" padding="16" rounded="12" style={ fontSize: "18", fontWeight: "600" }
      }
    }
  }
}

function showProjects() {
  activeSection = "projects"
}

function showContact() {
  activeSection = "contact"
}`
  },
  {
    id: 'landing-page-app',
    name: '📱 App Landing Page',
    description: 'Mobile app showcase landing page',
    code: `component AppLanding {
  state email = ""
  state platform = "ios"
  
  container style={ maxWidth: "1200", margin: "0 auto", padding: "20" } {
    row style={ justifyContent: "space-between", alignItems: "center", padding: "20 0" } {
      h1 "📱 TaskMaster" style={ fontSize: "32", color: "#1e293b", fontWeight: "800" }
      
      row gap="16" {
        button "Features" bg="transparent" color="#64748b"
        button "Download" bg="#10b981" color="white" padding="12" rounded="8"
      }
    }
    
    row gap="40" style={ marginTop: "60", alignItems: "center" } {
      column style={ flex: "1" } {
        h1 "Organize Your Life" style={ fontSize: "56", color: "#1e293b", fontWeight: "900", lineHeight: "1.2" }
        text "The most intuitive task management app for iOS and Android" style={ fontSize: "20", color: "#64748b", marginTop: "20", lineHeight: "1.6" }
        
        row gap="12" style={ marginTop: "32" } {
          button "App Store" bg="#1e293b" color="white" padding="16" rounded="12" style={ fontSize: "16", fontWeight: "600" }
          button "Google Play" bg="#10b981" color="white" padding="16" rounded="12" style={ fontSize: "16", fontWeight: "600" }
        }
        
        text "⭐⭐⭐⭐⭐ 4.9/5 from 10,000+ users" style={ fontSize: "14", color: "#64748b", marginTop: "20" }
      }
      
      container style={ flex: "1" } {
        center height="500" bg="#f8fafc" rounded="24" {
          text "📱" style={ fontSize: "128" }
        }
      }
    }
    
    h2 "Powerful Features" style={ fontSize: "42", color: "#1e293b", textAlign: "center", marginTop: "100" }
    
    grid cols="3" gap="32" style={ marginTop: "60" } {
      column gap="16" {
        container bg="#dbeafe" width="64" height="64" rounded="16" {
          center height="64" {
            text "✓" style={ fontSize: "32", color: "#1e40af" }
          }
        }
        h3 "Smart Lists" style={ fontSize: "24", color: "#1e293b" }
        text "Organize tasks with intelligent categorization and tags" style={ fontSize: "16", color: "#64748b", lineHeight: "1.6" }
      }
      
      column gap="16" {
        container bg="#fef3c7" width="64" height="64" rounded="16" {
          center height="64" {
            text "🔔" style={ fontSize: "32" }
          }
        }
        h3 "Reminders" style={ fontSize: "24", color: "#1e293b" }
        text "Never miss a deadline with smart notifications" style={ fontSize: "16", color: "#64748b", lineHeight: "1.6" }
      }
      
      column gap="16" {
        container bg="#d1fae5" width="64" height="64" rounded="16" {
          center height="64" {
            text "👥" style={ fontSize: "32" }
          }
        }
        h3 "Collaboration" style={ fontSize: "24", color: "#1e293b" }
        text "Share lists and work together with your team" style={ fontSize: "16", color: "#64748b", lineHeight: "1.6" }
      }
    }
    
    container bg="#10b981" padding="80" rounded="24" style={ marginTop: "100" } {
      center {
        column gap="32" {
          h2 "Start Getting Things Done" color="white" style={ fontSize: "42", fontWeight: "900", textAlign: "center" }
          text "Join thousands of productive people using TaskMaster" color="white" style={ fontSize: "20", textAlign: "center", opacity: "0.9" }
          
          row gap="12" style={ justifyContent: "center" } {
            input "Enter your email" value=email style={ padding: "16", borderRadius: "12", width: "300", fontSize: "16" }
            button "Get Started" bg="#1e293b" color="white" padding="16" rounded="12" style={ fontSize: "16", fontWeight: "600" }
          }
        }
      }
    }
  }
}`
  },
  {
    id: 'dashboard-analytics',
    name: '📊 Analytics Dashboard',
    description: 'Business analytics dashboard',
    code: `component AnalyticsDashboard {
  state totalUsers = 12543
  state revenue = 45678
  state activeNow = 234
  state timeRange = "week"
  
  computed revenueFormatted = "$" + revenue
  computed growthRate = "+12.5%"
  
  container style={ maxWidth: "1400", margin: "0 auto", padding: "40", background: "#f8fafc", minHeight: "100vh" } {
    row style={ justifyContent: "space-between", alignItems: "center", marginBottom: "40" } {
      h1 "📊 Analytics Dashboard" style={ fontSize: "36", color: "#1e293b", fontWeight: "800" }
      
      row gap="12" {
        button "Today" onClick=setToday bg="#e2e8f0" color="#1e293b" padding="12" rounded="8"
        button "Week" onClick=setWeek bg="#3b82f6" color="white" padding="12" rounded="8"
        button "Month" onClick=setMonth bg="#e2e8f0" color="#1e293b" padding="12" rounded="8"
      }
    }
    
    grid cols="4" gap="24" {
      container bg="white" padding="24" rounded="16" shadow="0 1px 3px rgba(0,0,0,0.1)" {
        text "👥" style={ fontSize: "32" }
        h3 "Total Users" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        text "{totalUsers}" style={ fontSize: "32", color: "#1e293b", fontWeight: "700", marginTop: "8" }
        text "{growthRate} from last week" style={ fontSize: "14", color: "#10b981", marginTop: "8" }
      }
      
      container bg="white" padding="24" rounded="16" shadow="0 1px 3px rgba(0,0,0,0.1)" {
        text "💰" style={ fontSize: "32" }
        h3 "Revenue" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        text "{revenueFormatted}" style={ fontSize: "32", color: "#1e293b", fontWeight: "700", marginTop: "8" }
        text "+8.2% from last week" style={ fontSize: "14", color: "#10b981", marginTop: "8" }
      }
      
      container bg="white" padding="24" rounded="16" shadow="0 1px 3px rgba(0,0,0,0.1)" {
        text "🟢" style={ fontSize: "32" }
        h3 "Active Now" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        text "{activeNow}" style={ fontSize: "32", color: "#1e293b", fontWeight: "700", marginTop: "8" }
        text "Real-time users" style={ fontSize: "14", color: "#64748b", marginTop: "8" }
      }
      
      container bg="white" padding="24" rounded="16" shadow="0 1px 3px rgba(0,0,0,0.1)" {
        text "📈" style={ fontSize: "32" }
        h3 "Conversion" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        text "3.24%" style={ fontSize: "32", color: "#1e293b", fontWeight: "700", marginTop: "8" }
        text "+0.4% from last week" style={ fontSize: "14", color: "#10b981", marginTop: "8" }
      }
    }
    
    row gap="24" style={ marginTop: "24" } {
      container bg="white" padding="32" rounded="16" shadow="0 1px 3px rgba(0,0,0,0.1)" style={ flex: "2" } {
        h2 "Revenue Overview" style={ fontSize: "20", color: "#1e293b", fontWeight: "600" }
        
        container bg="#f8fafc" height="300" rounded="12" style={ marginTop: "20" } {
          center height="300" {
            column gap="16" {
              text "📊" style={ fontSize: "64" }
              text "Chart visualization would go here" style={ fontSize: "16", color: "#64748b" }
            }
          }
        }
      }
      
      container bg="white" padding="32" rounded="16" shadow="0 1px 3px rgba(0,0,0,0.1)" style={ flex: "1" } {
        h2 "Top Products" style={ fontSize: "20", color: "#1e293b", fontWeight: "600" }
        
        column gap="16" style={ marginTop: "20" } {
          row style={ justifyContent: "space-between", alignItems: "center" } {
            text "Premium Plan" style={ fontSize: "16", color: "#1e293b" }
            text "$12,450" style={ fontSize: "16", color: "#10b981", fontWeight: "600" }
          }
          
          row style={ justifyContent: "space-between", alignItems: "center" } {
            text "Basic Plan" style={ fontSize: "16", color: "#1e293b" }
            text "$8,320" style={ fontSize: "16", color: "#10b981", fontWeight: "600" }
          }
          
          row style={ justifyContent: "space-between", alignItems: "center" } {
            text "Enterprise" style={ fontSize: "16", color: "#1e293b" }
            text "$24,890" style={ fontSize: "16", color: "#10b981", fontWeight: "600" }
          }
        }
      }
    }
  }
}

function setToday() {
  timeRange = "today"
}

function setWeek() {
  timeRange = "week"
}

function setMonth() {
  timeRange = "month"
}`
  }
];
