import '../styles/main.css';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';

export default function MainPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { isDarkMode } = useTheme();

    return (
      <div className="page">
        <section 
          id="slogan" 
          className="snap-section">
          <div className="container slogan">
            <div className="slogan-text">
              <h2>Your Canvas Awaits: Paint Your Dreams!</h2>
              <p className='main-info'>
              Aurelia is an intuitive tool that allows everyone, regardless of skill level, to create impressive images and designs. With a wide selection of templates, fonts and filters, you can easily adapt your work for social networks, advertising campaigns or personal projects. Our platform offers powerful image processing features to help you stand out from the rest. 
              <br/>Join us and open a world of endless possibilities for creativity!
              </p>
              <a className="btn" onClick={() => user? router.push('/projects') : router.push('/login')}>Try now</a>
            </div>
            <img src={`${isDarkMode ? 'images/jellyfish-b.jpg' : 'images/jellyfish-w.jpg'}`} alt="Decorative" className="slogan-image" />
          </div>
          <div className="more-info">
            <span>More info</span>
            <div className="arrow">&#x2193;</div>
        </div>
        </section>
  
        {/*<section 
          id="team" 
          className="snap-section">
          <div className="container">
            <h2>Our team</h2>
            <div className="flex">
              <div className="team-member frontend">
                <div className="image-box"></div>
                <p>Yana Levchenko<br/>frontend</p>
              </div>
              <div className="team-member backend">
                <div className="image-box"></div>
                <p>Denys Kolesnychenko<br/>backend</p>
              </div>
              <div className="team-member frontend">
                <div className="image-box"></div>
                <p>Anton Lukash<br/>frontend</p>
              </div>
              <div className="team-member backend">
                <div className="image-box"></div>
                <p>Maksym Hrytsenko<br/>backend</p>
              </div>
            </div>
          </div>
    </section>*/}

<section 
          id="audience" 
          className="snap-section">
          <div className="container">
            <h2>Target audience</h2>
            <div className="flex audience-grid">
                <div className="audience-item">
                  <div className="sphere"><img style={isDarkMode ? {} : {padding: '5px'}} src={`/images/main/designers${isDarkMode ? '': '_white' }.png`} alt=''/></div>
                  <p>Designers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere bottom-sphere"><img src={`/images/main/marketers${isDarkMode ? '': '_white' }.png`} alt=''/></div>
                  <p className="bottom-sphere">Marketers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere"><img src={`/images/main/illustrators${isDarkMode ? '': '_white' }.png`} alt=''/></div>
                  <p>Illustrators</p>
                </div>
                <div className="audience-item">
                  <div className="sphere bottom-sphere"><img style={isDarkMode ? {} : {padding: '5px'}} src={`/images/main/games${isDarkMode ? '': '_white' }.png`} alt=''></img></div>
                  <p className="bottom-sphere">Game Developers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere"><img src={`/images/main/photo${isDarkMode ? '': '_white' }.png`} alt=''/></div>
                  <p>Photographers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere bottom-sphere"><img style={isDarkMode ? {} : {padding: '5px'}} src={`/images/main/students${isDarkMode ? '': '_white' }.png`} alt=''/></div>
                  <p className="bottom-sphere">Students</p>
                </div>
            </div>
          </div>
        </section>
  
        <section 
          id="tools" 
          className="snap-section">
          <div className="container">
            <h2>Tools</h2>
            <div className="flex">
              <div className="tool-video">
                <h3>Brush & Eraser</h3>
                <p>Draw freely or remove parts of your design with fully customizable stroke width, color, and opacity.</p>
                <div className="video-box">
                <video autoPlay loop muted>
                  <source src="/videos/paint.webm" type="video/webm" />
                </video>
                </div>
              </div>

              <div className="tool-row-right">
                <div className="tool-video">
                  <h3>Elements</h3>
                  <p>Add and customize shapes. Move, resize, and align them with ease.</p>
                  <div className="video-box">
                    <video autoPlay loop muted>
                      <source src="/videos/figures.webm" type="video/webm" />
                    </video>
                  </div>
                </div>
              </div>

              <div className="tool-video">
                <h3>Images</h3>
                <p>Upload your own images or explore the integrated gallery. Drag, resize, and edit them on the canvas.</p>
                <div className="video-box">
                  <video autoPlay loop muted>
                    <source src="/videos/images.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  