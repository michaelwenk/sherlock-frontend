function HelpPanel() {
  return (
    <div
      style={{
        padding: '50px',
        width: '100%',
        height: '100%',
      }}
    >
      <p>
        Sherlock is a free and open-source tool which aims to support natural
        product chemists in terms of computer-assisted structure elucidation
        (CASE) via dereplication or{' '}
        <label style={{ fontStyle: 'italic' }}>de novo</label> elucidation of
        (un)known compounds. <br />
        <br />
        To obtain correlational data to use for CASE purposes, the input of the
        molecular formula and the peak picking within the 1D/2D NMR data have to
        be done in the{' '}
        <label style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
          Spectra
        </label>{' '}
        tab. That correlation data will be available in the{' '}
        <label style={{ fontStyle: 'italic', fontWeight: 'bold' }}>CASE</label>{' '}
        tab immediately after each changes. Different overviews can be found
        there as well as several settings for CASE-related functionalities.{' '}
        Further instructions exist in the manual below.
        <br />
        <br />
        Bugs or general issue reports can be done on GitHub for both the{' '}
        <a
          href="https://github.com/michaelwenk/sherlock"
          target="_blank"
          rel="noopener noreferrer"
        >
          backend
        </a>{' '}
        and the{' '}
        <a
          href="https://github.com/michaelwenk/sherlock-frontend"
          target="_blank"
          rel="noopener noreferrer"
        >
          frontend
        </a>
        . Also feature requests or contributions are welcome!
        <br />
        <br />
        This tool is developed and maintained by the Steinbeck group at the
        Friedrich-Schiller-University in Jena, Germany. The code is released
        under the MIT license. <br />
        Copyright © CC-BY-SA 2022
      </p>

      <iframe
        src="Sherlock_manual.pdf"
        width="100%"
        height="1000px"
        style={{ marginTop: '30px' }}
      ></iframe>
    </div>
  );
}

export default HelpPanel;
