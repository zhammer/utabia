import { useEffect, useState } from 'react'

export default function UtabiaScene() {
  const basePath = import.meta.env.BASE_URL || './'
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`utabia-scene ${isVisible ? 'visible' : ''}`}>
      {/* Raye on empty tab */}
      <div className="utabia-raye-container">
        <div className="utabia-raye-inner">
          <div className="utabia-empty-tab">
            <div className="tab-content">
              <span className="tab-close">×</span>
            </div>
          </div>
          <img
            src={`${basePath}raye.gif`}
            alt="Raye"
            className="utabia-raye"
          />
        </div>
      </div>

      {/* Utabia text */}
      <div className="utabia-message">Utabia</div>
    </div>
  )
}
