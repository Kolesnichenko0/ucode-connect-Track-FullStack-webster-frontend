import '../styles/main.css';

export default function MainPage() {

    return (
      <div className="page">
        <section 
          id="slogan" 
          className="snap-section">
          <div className="container slogan">
            <div className="slogan-text">
              <h2>Your Canvas Awaits: Paint Your Dreams!</h2>
              <p className='main-info'>
              Our graphics editor is an intuitive tool that allows everyone, regardless of skill level, to create impressive images and designs. With a wide selection of templates, fonts and filters, you can easily adapt your work for social networks, advertising campaigns or personal projects. Our platform offers powerful image processing features to help you stand out from the rest. 
              <br/>Join us and open a world of endless possibilities for creativity!
              </p>
              <a className="btn">Try now</a>
            </div>
            <img src='images/jellyfish1.png' alt="Decorative" className="slogan-image" />
          </div>
          <div className="more-info">
            <span>More info</span>
            <div className="arrow">&#x2193;</div>
        </div>
        </section>
  
        <section 
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
        </section>
  
        <section 
          id="tools" 
          className="snap-section">
          <div className="container">
            <h2>Tools</h2>
            <div className="flex">
              <div className="tool-video">
                <h3>Name</h3>
                <p>Desc</p>
                <div className="video-box">Video</div>
              </div>
              <div className="tool-video">
                <h3>Name</h3>
                <p>Desc</p>
                <div className="video-box">Video</div>
              </div>
              <div className="tool-video">
                <h3>Name</h3>
                <p>Desc</p>
                <div className="video-box">Video</div>
              </div>
            </div>
          </div>
        </section>
  
        <section 
          id="audience" 
          className="snap-section">
          <div className="container">
            <h2>Target audience</h2>
            <div className="flex audience-grid">
                <div className="audience-item">
                  <div className="sphere"><img src='/images/main/designers.png' alt=''/></div>
                  <p>Designers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere bottom-sphere"><img src='/images/main/marketers.png' alt=''/></div>
                  <p className="bottom-sphere">Marketers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere"><img src='/images/main/illustrators.png' alt=''/></div>
                  <p>Illustrators</p>
                </div>
                <div className="audience-item">
                  <div className="sphere bottom-sphere"><img src='/images/main/games.png' alt=''></img></div>
                  <p className="bottom-sphere">Game Developers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere"><img src='/images/main/photo.png' alt=''/></div>
                  <p>Photographers</p>
                </div>
                <div className="audience-item">
                  <div className="sphere bottom-sphere"><img src='/images/main/students.png' alt=''/></div>
                  <p className="bottom-sphere">Students</p>
                </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  