import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiZap, FiBarChart2, FiCheckCircle, FiArrowRight, FiShield, FiInfo, FiActivity, FiTrendingUp, FiAward, FiEye } from "react-icons/fi";

function HowItWorks() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const steps = [
    {
      number: "01",
      title: "Upload X-ray Images",
      description: "Select and upload chest X-ray images in JPEG, PNG, or WebP format with our intuitive drag-and-drop interface.",
      icon: FiUpload,
      color: "emerald",
      details: [
        "Supports up to 5 images per analysis",
        "Maximum 10MB per image",
        "Drag and drop or browse from device",
        "Automatic format validation",
        "Real-time upload progress"
      ],
      timing: "1-5 sec"
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our advanced ResNet18 CNN model analyzes the images in real-time with GradCAM visualization for interpretability.",
      icon: FiZap,
      color: "blue",
      details: [
        "Deep learning neural networks (ResNet18)",
        "Trained on thousands of medical images",
        "92%+ diagnostic accuracy rate",
        "GPU-accelerated inference",
        "GradCAM heatmap generation"
      ],
      timing: "10-15 sec"
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive detailed diagnostic reports with confidence scores, affected areas, and visual heatmap analysis highlighting suspicious regions.",
      icon: FiBarChart2,
      color: "purple",
      details: [
        "Confidence score for each image (0-100%)",
        "Affected lung regions identified",
        "Risk level assessment (Low/Medium/High)",
        "Heatmap visualization with color coding",
        "Detailed result explanation"
      ],
      timing: "Immediate"
    },
    {
      number: "04",
      title: "Medical Recommendations",
      description: "Get evidence-based recommendations, follow-up protocols, and automated workflow triggers for comprehensive patient care.",
      icon: FiCheckCircle,
      color: "teal",
      details: [
        "Specialist consultation guidance",
        "Recommended tests and procedures",
        "Follow-up care instructions",
        "Printable medical report (PDF)",
        "Automated notification system"
      ],
      timing: "Auto-triggered"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-12 px-4 pt-20 sm:pt-24 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="mb-6 relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 mb-4">
              How It Works
            </h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed mb-4">
            Revolutionary AI-powered tuberculosis detection system combining cutting-edge deep learning with medical expertise
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full text-emerald-300 text-sm font-medium">
              ⚡ Real-time Analysis
            </div>
            <div className="px-4 py-2 bg-teal-500/20 border border-teal-400/50 rounded-full text-teal-300 text-sm font-medium">
              🎯 92%+ Accuracy
            </div>
            <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-medium">
              🔒 HIPAA Compliant
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-400/60 transition">
            <div className="text-3xl font-bold text-emerald-300 mb-2">30s</div>
            <div className="text-sm text-emerald-200/80">Avg Analysis Time</div>
          </div>
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-teal-400/60 transition">
            <div className="text-3xl font-bold text-teal-300 mb-2">92%+</div>
            <div className="text-sm text-teal-200/80">Accuracy Rate</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/60 transition">
            <div className="text-3xl font-bold text-cyan-300 mb-2">11</div>
            <div className="text-sm text-cyan-200/80">DB Tables</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/60 transition">
            <div className="text-3xl font-bold text-blue-300 mb-2">4+</div>
            <div className="text-sm text-blue-200/80">Disease Models</div>
          </div>
        </div>

        {/* Interactive Steps Timeline */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-4">4-Step Process</h2>
          <p className="text-center text-emerald-200/70 mb-12">Simple, intuitive, and powerful</p>
          
          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              type ColorKey = 'emerald' | 'blue' | 'purple' | 'teal';
              const colorMap: Record<ColorKey, { bg: string; light: string; border: string; text: string }> = {
                emerald: { bg: 'from-emerald-600 to-emerald-700', light: 'emerald', border: 'emerald-400', text: 'emerald-100' },
                blue: { bg: 'from-blue-600 to-blue-700', light: 'blue', border: 'blue-400', text: 'blue-100' },
                purple: { bg: 'from-purple-600 to-purple-700', light: 'purple', border: 'purple-400', text: 'purple-100' },
                teal: { bg: 'from-teal-600 to-teal-700', light: 'teal', border: 'teal-400', text: 'teal-100' }
              };
              const colors = colorMap[step.color as ColorKey];
              
              return (
                <div 
                  key={index} 
                  className={`group relative transform transition-all duration-300 ${activeStep === index ? 'scale-100' : 'hover:scale-105'}`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  
                  <div className="relative grid md:grid-cols-[120px_1fr] gap-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-8 hover:border-${colors.light}-400/60 transition-all duration-300">
                    
                    {/* Step Number Circle */}
                    <div className="flex items-start justify-center md:justify-start">
                      <div className={`relative w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center text-white text-3xl font-black shadow-2xl transform transition-transform group-hover:scale-110 duration-300`}>
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative">{step.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between py-2">
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`p-3 bg-${colors.light}-500/20 rounded-xl border border-${colors.light}-400/50`}>
                            <IconComponent className={`text-3xl text-${colors.light}-300`} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                            <div className={`text-xs font-semibold text-${colors.light}-300/70 mt-1`}>⏱ {step.timing}</div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">{step.description}</p>

                        <div className="grid md:grid-cols-2 gap-3">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className={`w-2 h-2 bg-${colors.light}-400 rounded-full mt-2 flex-shrink-0`}></div>
                              <span className="text-slate-300 text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400">Progress</span>
                          <span className={`text-xs font-bold text-${colors.light}-300`}>{((index + 1) / steps.length * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-500`} style={{width: `${((index + 1) / steps.length * 100)}%`}}></div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    {index !== steps.length - 1 && (
                      <div className="hidden md:flex absolute -right-12 top-1/2 transform -translate-y-1/2">
                        <FiArrowRight className="text-slate-600 text-4xl" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Performance Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: "🎯", label: "Diagnostic Accuracy", value: "92%+", description: "Based on 10,000+ trained images" },
              { icon: "⚡", label: "Processing Speed", value: "10-15s", description: "GPU-accelerated inference" },
              { icon: "🔐", label: "Security Standard", value: "HIPAA", description: "Healthcare compliance" }
            ].map((metric, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-8 text-center backdrop-blur-sm hover:border-emerald-400/60 transition">
                  <div className="text-5xl mb-3">{metric.icon}</div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">{metric.value}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{metric.label}</h3>
                  <p className="text-sm text-slate-400">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Technical Architecture</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-400/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">💻</div>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition">Frontend Layer</h4>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><span className="text-blue-400">▸</span> React 18 + TypeScript</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">▸</span> Vite Build System</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">▸</span> Tailwind CSS</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">▸</span> Real-time State</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-400/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🔧</div>
                <h4 className="text-lg font-bold text-white group-hover:text-green-300 transition">API Layer</h4>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-400">▸</span> NestJS Framework</li>
                <li className="flex items-center gap-2"><span className="text-green-400">▸</span> TypeORM Database</li>
                <li className="flex items-center gap-2"><span className="text-green-400">▸</span> JWT Authentication</li>
                <li className="flex items-center gap-2"><span className="text-green-400">▸</span> 45+ Endpoints</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🧠</div>
                <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition">ML Engine</h4>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><span className="text-purple-400">▸</span> Flask API Server</li>
                <li className="flex items-center gap-2"><span className="text-purple-400">▸</span> ResNet18 Model</li>
                <li className="flex items-center gap-2"><span className="text-purple-400">▸</span> PyTorch Inference</li>
                <li className="flex items-center gap-2"><span className="text-purple-400">▸</span> GradCAM Heatmaps</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-red-400/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">💾</div>
                <h4 className="text-lg font-bold text-white group-hover:text-red-300 transition">Database</h4>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2"><span className="text-red-400">▸</span> PostgreSQL 12+</li>
                <li className="flex items-center gap-2"><span className="text-red-400">▸</span> 11 Normalized Tables</li>
                <li className="flex items-center gap-2"><span className="text-red-400">▸</span> ACID Compliance</li>
                <li className="flex items-center gap-2"><span className="text-red-400">▸</span> Full Indexing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Workflow Types */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Three Distinct Workflows</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm group-hover:border-green-400/60 transition">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">✓</div>
                <h4 className="text-2xl font-bold text-white mb-3">Normal Results</h4>
                <p className="text-slate-300 text-sm mb-6">Patient analysis complete without TB detection</p>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-green-400" /> Create X-Ray record</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-green-400" /> Store diagnosis</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-green-400" /> Update timeline</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-green-400" /> Timeline: 15-20s</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm group-hover:border-red-400/60 transition">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">⚠️</div>
                <h4 className="text-2xl font-bold text-white mb-3">TB Positive</h4>
                <p className="text-slate-300 text-sm mb-6">TB detected with high confidence</p>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-red-400" /> Trigger TB workflow</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-red-400" /> Create notifications</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-red-400" /> Schedule follow-up</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-red-400" /> Timeline: 20-25s</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-orange-500/30 rounded-2xl p-8 backdrop-blur-sm group-hover:border-orange-400/60 transition">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">↻</div>
                <h4 className="text-2xl font-bold text-white mb-3">Failed/Retry</h4>
                <p className="text-slate-300 text-sm mb-6">Analysis failed or timeout occurred</p>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-orange-400" /> Mark as FAILED</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-orange-400" /> Display error</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-orange-400" /> Offer re-analysis</div>
                  <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-orange-400" /> 90s timeout</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Advanced Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiShield, title: "Data Encryption", desc: "End-to-end encryption for all transmissions" },
              { icon: FiEye, title: "Heatmap Visualization", desc: "GradCAM attention maps for interpretability" },
              { icon: FiTrendingUp, title: "Risk Assessment", desc: "Confidence-based severity classification" },
              { icon: FiInfo, title: "GPU Acceleration", desc: "Fast inference on powerful hardware" },
              { icon: FiActivity, title: "Audit Logging", desc: "Comprehensive activity tracking" },
              { icon: FiAward, title: "Compliance Ready", desc: "HIPAA and data protection standards" }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-400/60 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 rounded-lg flex items-center justify-center mb-4 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition">
                    <Icon className="text-emerald-300 text-xl" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
        {/* Presentation Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-4">📚 Deep Dive Documentation</h2>
          <p className="text-center text-emerald-200/70 mb-12">Explore our comprehensive presentation suite</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "System Architecture",
                icon: "🏛️",
                desc: "Complete 4-tier architecture with 11-table database schema and relationship diagrams",
                color: "blue",
                path: "/system-architecture"
              },
              {
                title: "TB Workflows",
                icon: "⚙️",
                desc: "Three distinct workflows with database impacts for each analysis scenario",
                color: "purple",
                path: "/workflow-explanation"
              },
              {
                title: "Technology Stack",
                icon: "⚡",
                desc: "Comprehensive overview of all frameworks, tools, and technical specifications",
                color: "orange",
                path: "/technology-stack"
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(item.path)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  item.color === 'blue' ? 'from-blue-600 to-blue-700' :
                  item.color === 'purple' ? 'from-purple-600 to-purple-700' :
                  'from-orange-600 to-orange-700'
                } opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl`}></div>
                
                <div className={`relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 border ${
                  item.color === 'blue' ? 'border-blue-500/30' :
                  item.color === 'purple' ? 'border-purple-500/30' :
                  'border-orange-500/30'
                } rounded-2xl p-8 backdrop-blur-sm group-hover:${item.color === 'blue' ? 'border-blue-400/60' : item.color === 'purple' ? 'border-purple-400/60' : 'border-orange-400/60'} transition-all duration-300 h-full flex flex-col justify-between`}>
                  <div>
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center gap-2 text-sm font-bold ${
                    item.color === 'blue' ? 'text-blue-400' :
                    item.color === 'purple' ? 'text-purple-400' :
                    'text-orange-400'
                  } group-hover:translate-x-1 transition-transform">
                    Explore Now
                    <FiArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-10 backdrop-blur-sm hover:border-blue-400/60 transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/50 rounded-lg flex items-center justify-center">
                <FiShield className="text-blue-300 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">🔐 Security First</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Enterprise-grade security with encryption, authentication, and compliance standards built into every layer.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                End-to-end encryption for data transmission
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                HIPAA-compliant patient data handling
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                JWT token authentication with secure sessions
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Role-based access control (4 roles)
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Comprehensive audit logging and traceability
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-10 backdrop-blur-sm hover:border-emerald-400/60 transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/50 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-emerald-300 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">⚡ Performance</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Optimized for speed, reliability, and scalability with comprehensive error handling and recovery mechanisms.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                GPU-accelerated inference (10-15 seconds)
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Real-time Base64 image encoding/decoding
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                90-second timeout protection with retry logic
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                3-stage image validation pipeline
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Automatic recovery from analysis failures
              </li>
            </ul>
          </div>
        </div>

        {/* Important Notes */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-l-4 border-yellow-400 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">⚠️</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">For Physicians Only</h3>
                <p className="text-slate-300">
                  This system is designed exclusively for licensed healthcare professionals. Results should support clinical judgment, not replace professional medical evaluation. Always consult patient history and symptoms before diagnosis.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-l-4 border-green-400 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">🔒</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy Guaranteed</h3>
                <p className="text-slate-300">
                  All patient data and medical images are encrypted and stored securely. We comply with HIPAA, GDPR, and international data protection standards. Your patient's privacy is our highest priority.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-3xl p-16 text-center backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4">
                Ready to Transform Patient Care?
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Start using E-Afya today to detect tuberculosis with AI-powered precision and improve patient outcomes
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
              <button
                onClick={() => navigate("/system-architecture")}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 text-lg"
              >
                <span>📚 Start Presentation Tour</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg border border-slate-600"
              >
                Get Started ✓
              </button>
            </div>

            <p className="text-slate-400 text-sm mt-8">
              ✓ No credit card required  •  ✓ Free trial available  •  ✓ 24/7 support included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
